// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {PropertyDeed} from "./PropertyDeed.sol";
import {DeedDAO} from "../governace/DeedDAO.sol";
import {RevenueDistributor} from "../finance/RevenueDistributor.sol";
import {LoanManager} from "../finance/LoanManager.sol";
import {PropertyToken} from "./PropertyToken.sol";

// ============================================================================
// PROPERTY FACTORY (Main Contract - Updated for ERC-1155)
// ============================================================================

contract PropertyFactory is Ownable, ReentrancyGuard, Pausable {
    using Math for uint256;

    struct PropertyInfo {
        uint256 id;
        string name;
        string symbol;
        uint256 totalValue;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        bool isActive;
        bool allowsFractionalOwnership;
        bool rentAvailable;
        bool loanAvailable;
        uint256 rentPrice;
        uint256 loanToValue;
        uint256 interestRate;
        uint256 expectedReturn;
        uint256 minInvestment;
        string metadataURI;
        uint256 createdAt;
    }

    mapping(uint256 => PropertyInfo) public properties;
    mapping(address => uint256[]) public userProperties;
    mapping(address => mapping(uint256 => uint256)) public userShares;

    PropertyDeed public propertyDeed;
    PropertyToken public propertyToken;
    DeedDAO public deedDAO;
    RevenueDistributor public revenueDistributor;
    LoanManager public loanManager;

    uint256 public nextPropertyId = 1;
    uint256 public constant MIN_OWNERSHIP_FOR_LOAN = 5000;
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 250;

    event PropertyCreated(uint256 indexed propertyId, string name, uint256 totalValue, uint256 totalShares);
    event SharesPurchased(uint256 indexed propertyId, address indexed buyer, uint256 shares, uint256 cost);
    event SharesSold(uint256 indexed propertyId, address indexed seller, uint256 shares, uint256 proceeds);
    event PropertyRented(uint256 indexed propertyId, address indexed tenant, uint256 rentAmount);
    event LoanInitiated(uint256 indexed propertyId, address indexed borrower, uint256 loanAmount);
    event PropertyUpdated(uint256 indexed propertyId, uint256 newValue);

    constructor() Ownable(msg.sender) {
        propertyDeed = new PropertyDeed();
        propertyToken = new PropertyToken();
        deedDAO = new DeedDAO();
        revenueDistributor = new RevenueDistributor();
        loanManager = new LoanManager(address(propertyDeed));

        // Setup authorizations
        propertyToken.addAuthorizedMinter(address(this));
        propertyToken.addAuthorizedOperator(address(this));
    }

    function createProperty(
        string memory name,
        string memory symbol,
        uint256 totalValue,
        uint256 totalShares,
        uint256 pricePerShare,
        string memory metadataURI,
        bool allowsFractionalOwnership,
        uint256 rentPrice,
        uint256 loanToValue,
        uint256 interestRate,
        uint256 expectedReturn,
        uint256 minInvestment
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 propertyId = nextPropertyId++;

        // Create property in PropertyToken contract
        uint256 tokenPropertyId;
        uint256 tokenId;
        (tokenPropertyId, tokenId) = propertyToken.createProperty(
            name,
            symbol,
            totalShares,
            pricePerShare,
            totalValue,
            metadataURI
        );

        require(tokenPropertyId == propertyId, "Property ID mismatch");

        // Create property deed
        uint256 deedId = propertyDeed.createProperty(metadataURI, totalValue, address(propertyToken));

        // Store property info
        properties[propertyId] = PropertyInfo({
            id: propertyId,
            name: name,
            symbol: symbol,
            totalValue: totalValue,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            isActive: true,
            allowsFractionalOwnership: allowsFractionalOwnership,
            rentAvailable: rentPrice > 0,
            loanAvailable: loanToValue > 0,
            rentPrice: rentPrice,
            loanToValue: loanToValue,
            interestRate: interestRate,
            expectedReturn: expectedReturn,
            minInvestment: minInvestment,
            metadataURI: metadataURI,
            createdAt: block.timestamp
        });

        // Setup integrations
        deedDAO.addProperty(propertyId, address(propertyToken));
        revenueDistributor.addProperty(propertyId, address(propertyToken));

        emit PropertyCreated(propertyId, name, totalValue, totalShares);
        return propertyId;
    }

    function buyShares(uint256 propertyId, uint256 shares) external payable nonReentrant whenNotPaused {
        PropertyInfo storage property = properties[propertyId];
        require(property.isActive, "Property not active");
        require(property.allowsFractionalOwnership, "Fractional ownership not allowed");
        require(shares > 0 && shares <= property.availableShares, "Invalid share amount");
        require(shares * property.pricePerShare >= property.minInvestment, "Below minimum investment");

        uint256 cost = shares * property.pricePerShare;
        uint256 platformFee = (cost * PLATFORM_FEE_PERCENTAGE) / 10000;
        uint256 totalCost = cost + platformFee;

        require(msg.value >= totalCost, "Insufficient payment");

        // Mint shares to buyer
        propertyToken.mintShares(propertyId, msg.sender, shares, cost);
        property.availableShares = property.availableShares - shares;
        userShares[msg.sender][propertyId] = userShares[msg.sender][propertyId] + shares;

        // Add to user's properties if not already there
        if (userShares[msg.sender][propertyId] == shares) {
            userProperties[msg.sender].push(propertyId);
        }

        // Refund excess payment
        if (msg.value > totalCost) {
            (bool success, ) = msg.sender.call{value: msg.value - totalCost}("");
            require(success, "Refund failed");
        }

        emit SharesPurchased(propertyId, msg.sender, shares, cost);

        // Check if buyer qualifies for loan (>=50% ownership)
        uint256 userTotalShares = userShares[msg.sender][propertyId];
        uint256 ownershipPercentage = (userTotalShares * 10000) / property.totalShares;

        if (ownershipPercentage >= MIN_OWNERSHIP_FOR_LOAN && property.loanAvailable) {
            uint256 maxLoanAmount = (property.totalValue * property.loanToValue) / 10000;
            emit LoanInitiated(propertyId, msg.sender, maxLoanAmount);
        }
    }

    function sellShares(uint256 propertyId, uint256 shares) external nonReentrant whenNotPaused {
        PropertyInfo storage property = properties[propertyId];
        require(property.isActive, "Property not active");
        require(userShares[msg.sender][propertyId] >= shares, "Insufficient shares");

        uint256 proceeds = shares * property.pricePerShare;
        uint256 platformFee = (proceeds * PLATFORM_FEE_PERCENTAGE) / 10000;
        uint256 netProceeds = proceeds - platformFee;

        // Burn shares
        propertyToken.burnShares(propertyId, msg.sender, shares);
        property.availableShares = property.availableShares + shares;
        userShares[msg.sender][propertyId] = userShares[msg.sender][propertyId] - shares;

        // Remove from user's properties if no shares left
        if (userShares[msg.sender][propertyId] == 0) {
            removeUserProperty(msg.sender, propertyId);
        }

        // Transfer proceeds
        (bool success, ) = msg.sender.call{value: netProceeds}("");
        require(success, "Transfer failed");

        emit SharesSold(propertyId, msg.sender, shares, netProceeds);
    }

    function rentProperty(uint256 propertyId) external payable nonReentrant {
        PropertyInfo memory property = properties[propertyId];
        require(property.isActive, "Property not active");
        require(property.rentAvailable, "Rent not available");
        require(msg.value >= property.rentPrice, "Insufficient rent payment");

        // Add rent revenue to distributor
        revenueDistributor.addRevenue{value: msg.value}(propertyId);

        emit PropertyRented(propertyId, msg.sender, msg.value);
    }

    function updatePropertyValue(uint256 propertyId, uint256 newValue) external onlyOwner {
        require(properties[propertyId].isActive, "Property not active");
        
        properties[propertyId].totalValue = newValue;
        propertyToken.updatePropertyValue(propertyId, newValue);
        propertyDeed.updateProperty(propertyId, newValue);

        emit PropertyUpdated(propertyId, newValue);
    }

    function lockPropertyTransfers(uint256 propertyId, bool locked) external onlyOwner {
        require(properties[propertyId].isActive, "Property not active");
        propertyToken.lockPropertyTransfers(propertyId, locked);
    }

    function deactivateProperty(uint256 propertyId) external onlyOwner {
        properties[propertyId].isActive = false;
        propertyToken.deactivateProperty(propertyId);
    }

    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================

    function getPropertyInfo(uint256 propertyId) external view returns (PropertyInfo memory) {
        return properties[propertyId];
    }

    function getUserProperties(address user) external view returns (uint256[] memory) {
        return userProperties[user];
    }

    function getUserShares(address user, uint256 propertyId) external view returns (uint256) {
        return userShares[user][propertyId];
    }

    function getUserPortfolio(address user) external view returns (
        uint256[] memory propertyIds,
        uint256[] memory shares,
        uint256[] memory values
    ) {
        uint256[] memory userProps = userProperties[user];
        uint256 count = userProps.length;
        
        propertyIds = new uint256[](count);
        shares = new uint256[](count);
        values = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 propertyId = userProps[i];
            uint256 userShare = userShares[user][propertyId];
            
            propertyIds[i] = propertyId;
            shares[i] = userShare;
            values[i] = userShare * properties[propertyId].pricePerShare;
        }
    }

    function getPropertyStats(uint256 propertyId) external view returns (
        uint256 totalShares,
        uint256 availableShares,
        uint256 totalValue,
        uint256 pricePerShare,
        bool isActive
    ) {
        PropertyInfo memory property = properties[propertyId];
        return (
            property.totalShares,
            property.availableShares,
            property.totalValue,
            property.pricePerShare,
            property.isActive
        );
    }

    // ============================================================================
    // INTERNAL FUNCTIONS
    // ============================================================================

    function removeUserProperty(address user, uint256 propertyId) internal {
        uint256[] storage userProps = userProperties[user];
        for (uint256 i = 0; i < userProps.length; i++) {
            if (userProps[i] == propertyId) {
                userProps[i] = userProps[userProps.length - 1];
                userProps.pop();
                break;
            }
        }
    }

    // ============================================================================
    // ADMIN FUNCTIONS
    // ============================================================================

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function withdrawFees() external onlyOwner {
        // Platform fee withdrawal logic
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Fee withdrawal failed");
    }

    // ============================================================================
    // RECEIVE FUNCTION
    // ============================================================================

    receive() external payable {}
}
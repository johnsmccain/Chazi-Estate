// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {AutomationCompatible} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {IPropertyToken} from "../interfaces/IPropertyToken.sol";
import {PropertyDeed} from "./PropertyDeed.sol";
import {DeedDAO} from "../governace/DeedDAO.sol";
import {RevenueDistributor} from "../finance/RevenueDistributor.sol";
import {LoanManager} from "../finance/LoanManager.sol";
import {PropertyToken} from "./PropertyToken.sol";
// ============================================================================
// PROPERTY FACTORY (Main Contract)
// ============================================================================

contract PropertyFactory is Ownable, ReentrancyGuard, Pausable {
    using Math for uint256;
    
    struct PropertyInfo {
        uint256 id;
        string name;
        address propertyToken;
        address propertyDeed;
        uint256 totalValue;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        bool isActive;
        bool allowsFractionalOwnership;
        uint256 createdAt;
    }
    
    mapping(uint256 => PropertyInfo) public properties;
    mapping(address => uint256[]) public userProperties;
    uint256 public nextPropertyId = 1;
    
    PropertyDeed public propertyDeed;
    DeedDAO public deedDAO;
    RevenueDistributor public revenueDistributor;
    LoanManager public loanManager;
    
    uint256 public constant MIN_OWNERSHIP_FOR_LOAN = 5000; // 50% in basis points
    
    event PropertyCreated(uint256 indexed propertyId, string name, address indexed propertyToken, uint256 totalValue);
    event SharesPurchased(uint256 indexed propertyId, address indexed buyer, uint256 shares, uint256 cost);
    event SharesSold(uint256 indexed propertyId, address indexed seller, uint256 shares, uint256 proceeds);
    event PropertyRented(uint256 indexed propertyId, address indexed tenant, uint256 rentAmount);
    event LoanInitiated(uint256 indexed propertyId, address indexed borrower, uint256 loanAmount);
    
    constructor() Ownable(msg.sender) {
        propertyDeed = new PropertyDeed();
        deedDAO = new DeedDAO();
        revenueDistributor = new RevenueDistributor();
        loanManager = new LoanManager(address(propertyDeed));
    }
    
    function createProperty(
        string memory name,
        string calldata symbol,
        uint256 totalValue,
        uint256 totalShares,
        uint256 pricePerShare,
        string calldata metadataURI,
        bool allowsFractionalOwnership
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 propertyId = nextPropertyId++;
        
        // Create property token
        PropertyToken propertyToken = new PropertyToken(
            name,
            symbol,
            propertyId,
            totalShares,
            totalValue
        );
        
        // Create property deed
        uint256 deedId = propertyDeed.createProperty(metadataURI, totalValue, address(propertyToken));
        
        // Store property info
        properties[propertyId] = PropertyInfo({
            id: propertyId,
            name: name,
            propertyToken: address(propertyToken),
            propertyDeed: address(propertyDeed),
            totalValue: totalValue,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            isActive: true,
            allowsFractionalOwnership: allowsFractionalOwnership,
            createdAt: block.timestamp
        });
        
        // Setup integrations
        propertyToken.addAuthorizedMinter(address(this));
        deedDAO.addProperty(propertyId, address(propertyToken));
        revenueDistributor.addProperty(propertyId, address(propertyToken));
        
        emit PropertyCreated(propertyId, name, address(propertyToken), totalValue);
        return propertyId;
    }
    
    function buyShares(uint256 propertyId, uint256 shares) external payable nonReentrant whenNotPaused {
        PropertyInfo storage property = properties[propertyId];
        require(property.isActive, "Property not active");
        require(property.allowsFractionalOwnership, "Fractional ownership not allowed");
        require(shares > 0 && shares <= property.availableShares, "Invalid share amount");
        
        uint256 cost = shares * (property.pricePerShare);
        require(msg.value >= cost, "Insufficient payment");
        
        // Mint shares to buyer
        IPropertyToken(property.propertyToken).mint(msg.sender, shares);
        property.availableShares = property.availableShares - (shares);
        
        // Add to user's properties
        userProperties[msg.sender].push(propertyId);
        
        // Refund excess payment
        if (msg.value > cost) {
            (bool success, ) = msg.sender.call{value: msg.value -(cost)}("");
            require(success, "Refund failed");
        }
        
        emit SharesPurchased(propertyId, msg.sender, shares, cost);
        
        // Check if buyer qualifies for loan (>=50% ownership)
        IPropertyToken token = IPropertyToken(property.propertyToken);
        uint256 userShares = token.balanceOf(msg.sender);
        uint256 ownershipPercentage = userShares * (10000) / (property.totalShares);
        
        if (ownershipPercentage >= MIN_OWNERSHIP_FOR_LOAN) {
            // Eligible for loan - could trigger loan creation process
            emit LoanInitiated(propertyId, msg.sender, property.totalValue - (cost));
        }
    }
    
    function sellShares(uint256 propertyId, uint256 shares) external nonReentrant whenNotPaused {
        PropertyInfo storage property = properties[propertyId];
        require(property.isActive, "Property not active");
        
        IPropertyToken token = IPropertyToken(property.propertyToken);
        require(token.balanceOf(msg.sender) >= shares, "Insufficient shares");
        
        uint256 proceeds = shares*(property.pricePerShare);
        
        // Burn shares
        token.burn(msg.sender, shares);
        property.availableShares = property.availableShares+(shares);
        
        // Transfer proceeds
        (bool success, ) = msg.sender.call{value: proceeds}("");
        require(success, "Transfer failed");
        
        emit SharesSold(propertyId, msg.sender, shares, proceeds);
    }
    
    function rentProperty(uint256 propertyId) external payable nonReentrant {
        PropertyInfo memory property = properties[propertyId];
        require(property.isActive, "Property not active");
        require(msg.value > 0, "Rent amount must be greater than 0");
        
        // Add rent revenue to distributor
        revenueDistributor.addRevenue{value: msg.value}(propertyId);
        
        emit PropertyRented(propertyId, msg.sender, msg.value);
    }
    
    function getPropertyInfo(uint256 propertyId) external view returns (PropertyInfo memory) {
        return properties[propertyId];
    }
    
    function getUserProperties(address user) external view returns (uint256[] memory) {
        return userProperties[user];
    }
    
    function getUserShares(address user, uint256 propertyId) external view returns (uint256) {
        PropertyInfo memory property = properties[propertyId];
        return IPropertyToken(property.propertyToken).balanceOf(user);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency withdrawal function
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    // receive() external payable {}
}
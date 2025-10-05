// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IPropertyToken} from "../interfaces/IPropertyToken.sol";

contract RevenueDistributor is Ownable, ReentrancyGuard {
    struct PropertyRevenue {
        uint256 totalRevenue;
        uint256 distributedRevenue;
        uint256 lastDistribution;
        bool isActive;
    }

    mapping(uint256 => PropertyRevenue) public propertyRevenues;
    mapping(uint256 => address) public propertyTokens;
    mapping(address => mapping(uint256 => uint256)) public userClaims;
    
    uint256 public constant PLATFORM_FEE = 500; // 5%

    event RevenueAdded(uint256 indexed propertyId, uint256 amount);
    event RevenueDistributed(uint256 indexed propertyId, uint256 amount);
    event RevenueClaimed(uint256 indexed propertyId, address indexed user, uint256 amount);
    event PropertyAdded(uint256 indexed propertyId, address tokenContract);

    constructor() Ownable(msg.sender) {}

    function addProperty(uint256 propertyId, address tokenContract) external onlyOwner {
        propertyTokens[propertyId] = tokenContract;
        propertyRevenues[propertyId].isActive = true;
        emit PropertyAdded(propertyId, tokenContract);
    }

    function addRevenue(uint256 propertyId) external payable {
        require(propertyRevenues[propertyId].isActive, "Property not active");
        require(msg.value > 0, "No revenue to add");

        uint256 platformFee = (msg.value * PLATFORM_FEE) / 10000;
        uint256 netRevenue = msg.value - platformFee;

        propertyRevenues[propertyId].totalRevenue += netRevenue;

        // Send platform fee to owner
        (bool success, ) = owner().call{value: platformFee}("");
        require(success, "Platform fee transfer failed");

        emit RevenueAdded(propertyId, netRevenue);
    }

    function distributeRevenue(uint256 propertyId) external nonReentrant {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        require(revenue.isActive, "Property not active");
        
        uint256 pendingRevenue = revenue.totalRevenue - revenue.distributedRevenue;
        require(pendingRevenue > 0, "No revenue to distribute");

        revenue.distributedRevenue = revenue.totalRevenue;
        revenue.lastDistribution = block.timestamp;

        emit RevenueDistributed(propertyId, pendingRevenue);
    }

    function claimRevenue(uint256 propertyId) external nonReentrant {
        require(propertyRevenues[propertyId].isActive, "Property not active");
        
        uint256 claimableAmount = getClaimableRevenue(msg.sender, propertyId);
        require(claimableAmount > 0, "No revenue to claim");

        userClaims[msg.sender][propertyId] += claimableAmount;

        (bool success, ) = msg.sender.call{value: claimableAmount}("");
        require(success, "Revenue claim failed");

        emit RevenueClaimed(propertyId, msg.sender, claimableAmount);
    }

    function getClaimableRevenue(address user, uint256 propertyId) public view returns (uint256) {
        address tokenContract = propertyTokens[propertyId];
        if (tokenContract == address(0)) return 0;

        uint256 userShares = IPropertyToken(tokenContract).getUserShares(user, propertyId);
        if (userShares == 0) return 0;

        PropertyRevenue memory revenue = propertyRevenues[propertyId];
        uint256 totalShares = IPropertyToken(tokenContract).getPropertyInfo(propertyId).totalShares;
        
        uint256 userTotalShare = (revenue.distributedRevenue * userShares) / totalShares;
        uint256 alreadyClaimed = userClaims[user][propertyId];
        
        return userTotalShare > alreadyClaimed ? userTotalShare - alreadyClaimed : 0;
    }

    function getTotalRevenue(uint256 propertyId) external view returns (uint256) {
        return propertyRevenues[propertyId].totalRevenue;
    }

    function getPropertyRevenue(uint256 propertyId) external view returns (PropertyRevenue memory) {
        return propertyRevenues[propertyId];
    }

    receive() external payable {}
}
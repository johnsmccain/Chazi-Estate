// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {AutomationCompatible, AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {IPropertyToken} from "../interfaces/IPropertyToken.sol";


// ============================================================================
// REVENUE DISTRIBUTOR
// ============================================================================

contract RevenueDistributor is AutomationCompatibleInterface, Ownable, ReentrancyGuard {
    using Math for uint256;
    
    struct PropertyRevenue {
        uint256 totalRevenue;
        uint256 lastDistribution;
        uint256 pendingRevenue;
        bool isActive;
    }
    
    mapping(uint256 => PropertyRevenue) public propertyRevenues;
    mapping(uint256 => mapping(address => uint256)) public claimableRevenue;
    mapping(uint256 => address) public propertyTokens;
    
    uint256 public constant DISTRIBUTION_INTERVAL = 30 days;
    uint256[] public activeProperties;
    
    event RevenueAdded(uint256 indexed propertyId, uint256 amount);
    event RevenueDistributed(uint256 indexed propertyId, uint256 amount);
    event RevenueClaimed(uint256 indexed propertyId, address indexed user, uint256 amount);

    constructor() Ownable(msg.sender){}
    
    function addProperty(uint256 propertyId, address propertyToken) external onlyOwner {
        propertyTokens[propertyId] = propertyToken;
        propertyRevenues[propertyId] = PropertyRevenue({
            totalRevenue: 0,
            lastDistribution: block.timestamp,
            pendingRevenue: 0,
            isActive: true
        });
        activeProperties.push(propertyId);
    }
    
    function addRevenue(uint256 propertyId) external payable {
        
        require(propertyRevenues[propertyId].isActive, "Property not active");
        require(msg.value > 0, "Revenue must be greater than 0");
        
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        revenue.totalRevenue = revenue.totalRevenue + msg.value;
        revenue.pendingRevenue = revenue.pendingRevenue + msg.value;
        
        emit RevenueAdded(propertyId, msg.value);
    }
    
    function distributeRevenue(uint256 propertyId) public nonReentrant {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        require(revenue.isActive, "Property not active");
        require(revenue.pendingRevenue > 0, "No pending revenue");
        
        address propertyToken = propertyTokens[propertyId];
        require(propertyToken != address(0), "Property token not set");
        
        IPropertyToken token = IPropertyToken(propertyToken);
        uint256 totalSupply = token.totalSupply();
        require(totalSupply > 0, "No tokens minted");
        
        uint256 revenueToDistribute = revenue.pendingRevenue;
        revenue.pendingRevenue = 0;
        revenue.lastDistribution = block.timestamp;
        
        // Note: In a real implementation, you'd need to track all token holders
        // This is a simplified version that would require additional infrastructure
        
        emit RevenueDistributed(propertyId, revenueToDistribute);
    }
    
    function claimRevenue(uint256 propertyId) external nonReentrant {
        uint256 claimable = claimableRevenue[propertyId][msg.sender];
        require(claimable > 0, "No claimable revenue");
        
        claimableRevenue[propertyId][msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: claimable}("");
        require(success, "Transfer failed");
        
        emit RevenueClaimed(propertyId, msg.sender, claimable);
    }
    
    // Chainlink Automation
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        uint256[] memory propertiesToDistribute = new uint256[](activeProperties.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < activeProperties.length; i++) {
            uint256 propertyId = activeProperties[i];
            PropertyRevenue memory revenue = propertyRevenues[propertyId];
            
            bool needsDistribution = revenue.isActive && 
                                   revenue.pendingRevenue > 0 && 
                                   block.timestamp >= revenue.lastDistribution + DISTRIBUTION_INTERVAL;
            
            if (needsDistribution) {
                propertiesToDistribute[count] = propertyId;
                count++;
            }
        }
        
        if (count > 0) {
            // Resize array to actual count
            uint256[] memory result = new uint256[](count);
            for (uint256 i = 0; i < count; i++) {
                result[i] = propertiesToDistribute[i];
            }
            return (true, abi.encode(result));
        }
        
        return (false, "");
    }
    
    function performUpkeep(bytes calldata performData) external override {
        uint256[] memory propertiesToDistribute = abi.decode(performData, (uint256[]));
        
        for (uint256 i = 0; i < propertiesToDistribute.length; i++) {
            distributeRevenue(propertiesToDistribute[i]);
        }
    }
}

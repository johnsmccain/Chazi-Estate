// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IRevenueDistributor {
    struct PropertyRevenue {
        uint256 totalRevenue;
        uint256 distributedRevenue;
        uint256 lastDistribution;
        bool isActive;
    }

    function addRevenue(uint256 propertyId) external payable;
    function distributeRevenue(uint256 propertyId) external;
    function claimRevenue(uint256 propertyId) external;
    function getClaimableRevenue(address user, uint256 propertyId) external view returns (uint256);
    function getTotalRevenue(uint256 propertyId) external view returns (uint256);
    function getPropertyRevenue(uint256 propertyId) external view returns (PropertyRevenue memory);
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IRevenueDistributor {
    function distributeRevenue(uint256 propertyId) external;
    function addRevenue(uint256 propertyId) external payable;
}
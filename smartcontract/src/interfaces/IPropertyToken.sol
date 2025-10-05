// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IPropertyToken {
    struct PropertyInfo {
        uint256 propertyId;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        uint256 propertyValue;
        bool isActive;
        bool transfersLocked;
        uint256 createdAt;
        string metadataURI;
    }

    function getUserShares(address user, uint256 propertyId) external view returns (uint256);
    function getPropertyInfo(uint256 propertyId) external view returns (PropertyInfo memory);
    function mintShares(uint256 propertyId, address to, uint256 shares, uint256 cost) external;
    function burnShares(uint256 propertyId, address from, uint256 shares) external;
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IPropertyToken {
    // ERC1155 functions
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address account, address operator) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes calldata data) external;
    function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external;
    
    // Custom functions for property management
    function mintShares(uint256 propertyId, address to, uint256 shares, uint256 cost) external;
    function burnShares(uint256 propertyId, address from, uint256 shares) external;
    function mintToken(uint256 tokenId, address to, uint256 amount, bytes memory data) external;
    function burnToken(uint256 tokenId, address from, uint256 amount) external;
    
    // View functions
    function getPropertyInfo(uint256 propertyId) external view returns (
        uint256 id,
        uint256 totalShares,
        uint256 availableShares,
        uint256 pricePerShare,
        uint256 propertyValue,
        bool isActive,
        bool transfersLocked,
        uint256 createdAt,
        string memory metadataURI
    );
    
    function getTokenTypeInfo(uint256 tokenId) external view returns (
        uint256 id,
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 currentSupply,
        bool isActive,
        string memory metadataURI
    );
    
    function getUserShares(address user, uint256 propertyId) external view returns (uint256);
    function getUserTokenBalance(address user, uint256 tokenId) external view returns (uint256);
}
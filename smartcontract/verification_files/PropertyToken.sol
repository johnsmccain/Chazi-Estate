// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

// ============================================================================
// PROPERTY TOKEN (ERC-1155 for fractional shares and multi-token support)
// ============================================================================

contract PropertyToken is
    ERC1155,
    ERC1155URIStorage,
    Ownable,
    ReentrancyGuard,
    Pausable
{
    using Math for uint256;

    // Token ID structure:
    // - Token ID 0: Reserved for property ownership deed
    // - Token ID 1-999: Property fractional shares
    // - Token ID 1000+: Additional property-related tokens (rental rights, voting rights, etc.)

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

    struct TokenType {
        uint256 tokenId;
        string name;
        string symbol;
        uint256 maxSupply;
        uint256 currentSupply;
        bool isActive;
        string metadataURI;
    }

    mapping(uint256 => PropertyInfo) public properties;
    mapping(uint256 => TokenType) public tokenTypes;
    mapping(address => bool) public authorizedMinters;
    mapping(address => bool) public authorizedOperators;

    uint256 public nextPropertyId = 1;
    uint256 public nextTokenTypeId = 1000;

    event PropertyCreated(
        uint256 indexed propertyId,
        uint256 indexed tokenId,
        uint256 totalShares,
        uint256 propertyValue
    );
    event TokenTypeCreated(
        uint256 indexed tokenId,
        string name,
        string symbol,
        uint256 maxSupply
    );
    event SharesMinted(
        uint256 indexed propertyId,
        address indexed to,
        uint256 shares,
        uint256 cost
    );
    event SharesBurned(
        uint256 indexed propertyId,
        address indexed from,
        uint256 shares
    );
    event PropertyValueUpdated(uint256 indexed propertyId, uint256 newValue);
    event TransfersLocked(uint256 indexed propertyId, bool locked);
    event AuthorizedMinterAdded(address minter);
    event AuthorizedMinterRemoved(address minter);
    event AuthorizedOperatorAdded(address operator);
    event AuthorizedOperatorRemoved(address operator);

    modifier onlyAuthorizedMinter() {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "Not authorized minter"
        );
        _;
    }

    modifier onlyAuthorizedOperator() {
        require(
            authorizedOperators[msg.sender] || msg.sender == owner(),
            "Not authorized operator"
        );
        _;
    }

    modifier propertyExists(uint256 propertyId) {
        require(properties[propertyId].isActive, "Property does not exist");
        _;
    }

    modifier tokenTypeExists(uint256 tokenId) {
        require(tokenTypes[tokenId].isActive, "Token type does not exist");
        _;
    }

    constructor() ERC1155("") Ownable(msg.sender) {}

    // ============================================================================
    // PROPERTY MANAGEMENT
    // ============================================================================

    function createProperty(
        string memory name,
        string memory symbol,
        uint256 totalShares,
        uint256 pricePerShare,
        uint256 propertyValue,
        string memory metadataURI
    )
        external
        onlyAuthorizedOperator
        returns (uint256 propertyId, uint256 tokenId)
    {
        propertyId = nextPropertyId++;
        tokenId = propertyId; // Token ID matches property ID for shares

        properties[propertyId] = PropertyInfo({
            propertyId: propertyId,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            propertyValue: propertyValue,
            isActive: true,
            transfersLocked: false,
            createdAt: block.timestamp,
            metadataURI: metadataURI
        });

        tokenTypes[tokenId] = TokenType({
            tokenId: tokenId,
            name: name,
            symbol: symbol,
            maxSupply: totalShares,
            currentSupply: 0,
            isActive: true,
            metadataURI: metadataURI
        });

        emit PropertyCreated(propertyId, tokenId, totalShares, propertyValue);
    }

    function createTokenType(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        string memory metadataURI
    ) external onlyAuthorizedOperator returns (uint256 tokenId) {
        tokenId = nextTokenTypeId++;

        tokenTypes[tokenId] = TokenType({
            tokenId: tokenId,
            name: name,
            symbol: symbol,
            maxSupply: maxSupply,
            currentSupply: 0,
            isActive: true,
            metadataURI: metadataURI
        });

        emit TokenTypeCreated(tokenId, name, symbol, maxSupply);
    }

    // ============================================================================
    // MINTING AND BURNING
    // ============================================================================

    function mintShares(
        uint256 propertyId,
        address to,
        uint256 shares,
        uint256 cost
    ) external onlyAuthorizedMinter propertyExists(propertyId) nonReentrant {
        PropertyInfo storage property = properties[propertyId];
        require(
            shares > 0 && shares <= property.availableShares,
            "Invalid share amount"
        );

        uint256 tokenId = propertyId;
        property.availableShares = property.availableShares - shares;
        tokenTypes[tokenId].currentSupply =
            tokenTypes[tokenId].currentSupply +
            shares;

        _mint(to, tokenId, shares, "");

        emit SharesMinted(propertyId, to, shares, cost);
    }

    function burnShares(
        uint256 propertyId,
        address from,
        uint256 shares
    ) external onlyAuthorizedMinter propertyExists(propertyId) nonReentrant {
        require(shares > 0, "Invalid share amount");

        uint256 tokenId = propertyId;
        PropertyInfo storage property = properties[propertyId];
        property.availableShares = property.availableShares + shares;
        tokenTypes[tokenId].currentSupply =
            tokenTypes[tokenId].currentSupply -
            shares;

        _burn(from, tokenId, shares);

        emit SharesBurned(propertyId, from, shares);
    }

    function mintToken(
        uint256 tokenId,
        address to,
        uint256 amount,
        bytes memory data
    ) external onlyAuthorizedMinter tokenTypeExists(tokenId) nonReentrant {
        TokenType storage tokenType = tokenTypes[tokenId];
        require(
            tokenType.currentSupply + amount <= tokenType.maxSupply,
            "Exceeds max supply"
        );

        tokenType.currentSupply = tokenType.currentSupply + amount;
        _mint(to, tokenId, amount, data);
    }

    function burnToken(
        uint256 tokenId,
        address from,
        uint256 amount
    ) external onlyAuthorizedMinter tokenTypeExists(tokenId) nonReentrant {
        TokenType storage tokenType = tokenTypes[tokenId];
        tokenType.currentSupply = tokenType.currentSupply - amount;
        _burn(from, tokenId, amount);
    }

    // ============================================================================
    // TRANSFER CONTROL
    // ============================================================================

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override(ERC1155) whenNotPaused {
        super._update(from, to, ids, values);

        // Check if transfers are locked for any property shares
        for (uint256 i = 0; i < ids.length; i++) {
            uint256 tokenId = ids[i];
            if (tokenId <= 999 && properties[tokenId].transfersLocked) {
                require(
                    from == address(0) || to == address(0),
                    "Transfers locked for this property"
                );
            }
        }
    }

    // ============================================================================
    // PROPERTY MANAGEMENT
    // ============================================================================

    function updatePropertyValue(
        uint256 propertyId,
        uint256 newValue
    ) external onlyAuthorizedOperator propertyExists(propertyId) {
        properties[propertyId].propertyValue = newValue;
        emit PropertyValueUpdated(propertyId, newValue);
    }

    function lockPropertyTransfers(
        uint256 propertyId,
        bool locked
    ) external onlyAuthorizedOperator propertyExists(propertyId) {
        properties[propertyId].transfersLocked = locked;
        emit TransfersLocked(propertyId, locked);
    }

    function deactivateProperty(
        uint256 propertyId
    ) external onlyAuthorizedOperator propertyExists(propertyId) {
        properties[propertyId].isActive = false;
        tokenTypes[propertyId].isActive = false;
    }

    function deactivateTokenType(
        uint256 tokenId
    ) external onlyAuthorizedOperator tokenTypeExists(tokenId) {
        tokenTypes[tokenId].isActive = false;
    }

    // ============================================================================
    // AUTHORIZATION MANAGEMENT
    // ============================================================================

    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit AuthorizedMinterAdded(minter);
    }

    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit AuthorizedMinterRemoved(minter);
    }

    function addAuthorizedOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = true;
        emit AuthorizedOperatorAdded(operator);
    }

    function removeAuthorizedOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = false;
        emit AuthorizedOperatorRemoved(operator);
    }

    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================

    function getPropertyInfo(
        uint256 propertyId
    ) external view returns (PropertyInfo memory) {
        return properties[propertyId];
    }

    function getTokenTypeInfo(
        uint256 tokenId
    ) external view returns (TokenType memory) {
        return tokenTypes[tokenId];
    }

    function getUserShares(
        address user,
        uint256 propertyId
    ) external view returns (uint256) {
        return balanceOf(user, propertyId);
    }

    function getUserTokenBalance(
        address user,
        uint256 tokenId
    ) external view returns (uint256) {
        return balanceOf(user, tokenId);
    }

    function uri(
        uint256 tokenId
    )
        public
        view
        virtual
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        if (tokenId <= 999) {
            return properties[tokenId].metadataURI;
        } else {
            return tokenTypes[tokenId].metadataURI;
        }
    }

    // ============================================================================
    // PAUSE FUNCTIONALITY
    // ============================================================================

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

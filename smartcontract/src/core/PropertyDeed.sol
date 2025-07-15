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




// ============================================================================
// PROPERTY DEED (ERC721 for property ownership)
// ============================================================================

contract PropertyDeed is ERC721, Ownable {
    using Math for uint256;
    
    struct Property {
        string metadataURI;
        uint256 value;
        address propertyToken;
        bool isActive;
        uint256 createdAt;
    }
    
    mapping(uint256 => Property) public properties;
    uint256 public nextPropertyId = 1;
    
    event PropertyCreated(uint256 indexed propertyId, address indexed propertyToken, uint256 value);
    event PropertyUpdated(uint256 indexed propertyId, uint256 newValue);
    event PropertyDeactivated(uint256 indexed propertyId);
    
    constructor() ERC721("DeedAI Property", "DEED") Ownable(msg.sender) {}
    
    function createProperty(
        string calldata metadataURI,
        uint256 value,
        address propertyToken
    ) external onlyOwner returns (uint256) {
        uint256 propertyId = nextPropertyId++;
        
        properties[propertyId] = Property({
            metadataURI: metadataURI,
            value: value,
            propertyToken: propertyToken,
            isActive: true,
            createdAt: block.timestamp
        });
        
        _mint(msg.sender, propertyId);
        
        emit PropertyCreated(propertyId, propertyToken, value);
        return propertyId;
    }
    
    function updateProperty(uint256 propertyId, uint256 newValue) external onlyOwner {
        require(properties[propertyId].isActive, "Property not active");
        properties[propertyId].value = newValue;
        emit PropertyUpdated(propertyId, newValue);
    }
    
    function deactivateProperty(uint256 propertyId) external onlyOwner {
        properties[propertyId].isActive = false;
        emit PropertyDeactivated(propertyId);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Property does not exist");
        return properties[tokenId].metadataURI;
    }
}

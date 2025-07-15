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
// PROPERTY TOKEN (ERC20 for fractional shares)
// ============================================================================

contract PropertyToken is ERC20, Ownable, ReentrancyGuard {
    using Math for uint256;
    
    uint256 public immutable propertyId;
    uint256 public immutable maxSupply;
    uint256 public propertyValue;
    bool public transfersLocked;
    
    mapping(address => bool) public authorizedMinters;
    
    event TransfersLocked(bool locked);
    event PropertyValueUpdated(uint256 newValue);
    event AuthorizedMinterAdded(address minter);
    event AuthorizedMinterRemoved(address minter);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _propertyId,
        uint256 _maxSupply,
        uint256 _propertyValue
    ) ERC20(name, symbol) Ownable(msg.sender) {
        propertyId = _propertyId;
        maxSupply = _maxSupply;
        propertyValue = _propertyValue;
    }
    
    function mint(address to, uint256 amount) external onlyAuthorizedMinter nonReentrant {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyAuthorizedMinter nonReentrant {
        _burn(from, amount);
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(!transfersLocked, "Transfers are locked");
        return super.transfer(to, amount);
    }
    
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(!transfersLocked, "Transfers are locked");
        return super.transferFrom(from, to, amount);
    }
    
    function lockTransfers(bool _locked) external onlyOwner {
        transfersLocked = _locked;
        emit TransfersLocked(_locked);
    }
    
    function updatePropertyValue(uint256 _newValue) external onlyOwner {
        propertyValue = _newValue;
        emit PropertyValueUpdated(_newValue);
    }
    
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit AuthorizedMinterAdded(minter);
    }
    
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit AuthorizedMinterRemoved(minter);
    }
}

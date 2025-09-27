// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {PropertyToken} from "../src/core/PropertyToken.sol";


contract PropertyTokenTest is Test {
    PropertyToken public token;
    address public owner = address(1);
    address public minter = address(2);
    address public user = address(3);
    
    uint256 public constant PROPERTY_ID = 1;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant PROPERTY_VALUE = 1000 ether;
    
    function setUp() public {
        vm.prank(owner);
        token = new PropertyToken();
        
        vm.prank(owner);
        token.addAuthorizedMinter(minter);
        vm.prank(owner);
        token.addAuthorizedOperator(owner);
        
        // Create a property first
        vm.prank(owner);
        (uint256 propertyId, uint256 tokenId) = token.createProperty(
            "Test Property",
            "TPT",
            MAX_SUPPLY,
            100 ether, // price per share
            PROPERTY_VALUE,
            "https://example.com/metadata"
        );
    }
    
    function testMintTokens() public {
        uint256 amount = 1000;
        
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, amount, amount * 100 ether);
        
        assertEq(token.balanceOf(user, PROPERTY_ID), amount);
    }
    
    function testMintExceedsMaxSupply() public {
        uint256 amount = MAX_SUPPLY + 1;
        
        vm.expectRevert("Invalid share amount");
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, amount, amount * 100 ether);
    }
    
    function testBurnTokens() public {
        uint256 amount = 1000;
        
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, amount, amount * 100 ether);
        
        vm.prank(minter);
        token.burnShares(PROPERTY_ID, user, 500);
        
        assertEq(token.balanceOf(user, PROPERTY_ID), 500);
    }
    
    function testLockTransfers() public {
        uint256 amount = 1000;
        
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, amount, amount * 100 ether);
        
        vm.prank(owner);
        token.lockPropertyTransfers(PROPERTY_ID, true);
        
        vm.expectRevert("Transfers locked for this property");
        vm.prank(user);
        token.safeTransferFrom(user, address(4), PROPERTY_ID, 100, "");
        
        vm.prank(owner);
        token.lockPropertyTransfers(PROPERTY_ID, false);
        
        vm.prank(user);
        token.safeTransferFrom(user, address(4), PROPERTY_ID, 100, "");
        
        assertEq(token.balanceOf(address(4), PROPERTY_ID), 100);
    }
    
    function testOnlyAuthorizedMinterCanMint() public {
        vm.expectRevert("Not authorized minter");
        vm.prank(user);
        token.mintShares(PROPERTY_ID, user, 1000, 1000 * 100 ether);
    }
    
    // Fuzz tests
    function testFuzz_MintShares(uint256 shares) public {
        vm.assume(shares > 0 && shares <= 10000); // Within reasonable bounds
        
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, shares, shares * 100 ether);
        
        assertEq(token.balanceOf(user, PROPERTY_ID), shares);
    }
    
    function testFuzz_MintSharesExceedsAvailable(uint256 shares) public {
        vm.assume(shares > 10000 && shares < type(uint256).max / 100 ether); // Exceeds max supply but prevents overflow
        
        vm.expectRevert("Invalid share amount");
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, shares, shares * 100 ether);
    }
    
    function testFuzz_BurnShares(uint256 mintAmount, uint256 burnAmount) public {
        vm.assume(mintAmount > 0 && mintAmount <= 10000);
        vm.assume(burnAmount > 0 && burnAmount <= mintAmount);
        
        // Mint first
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, mintAmount, mintAmount * 100 ether);
        
        // Then burn
        vm.prank(minter);
        token.burnShares(PROPERTY_ID, user, burnAmount);
        
        assertEq(token.balanceOf(user, PROPERTY_ID), mintAmount - burnAmount);
    }
    
    function testFuzz_TransferShares(uint256 mintAmount, uint256 transferAmount) public {
        vm.assume(mintAmount > 0 && mintAmount <= 10000);
        vm.assume(transferAmount > 0 && transferAmount <= mintAmount);
        
        address recipient = address(0x123);
        
        // Mint first
        vm.prank(minter);
        token.mintShares(PROPERTY_ID, user, mintAmount, mintAmount * 100 ether);
        
        // Transfer
        vm.prank(user);
        token.safeTransferFrom(user, recipient, PROPERTY_ID, transferAmount, "");
        
        assertEq(token.balanceOf(user, PROPERTY_ID), mintAmount - transferAmount);
        assertEq(token.balanceOf(recipient, PROPERTY_ID), transferAmount);
    }
}

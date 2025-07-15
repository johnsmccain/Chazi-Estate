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
        token = new PropertyToken(
            "Test Property Token",
            "TPT",
            PROPERTY_ID,
            MAX_SUPPLY,
            PROPERTY_VALUE
        );
        
        vm.prank(owner);
        token.addAuthorizedMinter(minter);
    }
    
    function testMintTokens() public {
        uint256 amount = 1000;
        
        vm.prank(minter);
        token.mint(user, amount);
        
        assertEq(token.balanceOf(user), amount);
        assertEq(token.totalSupply(), amount);
    }
    
    function testMintExceedsMaxSupply() public {
        uint256 amount = MAX_SUPPLY + 1;
        
        vm.expectRevert("Exceeds max supply");
        vm.prank(minter);
        token.mint(user, amount);
    }
    
    function testBurnTokens() public {
        uint256 amount = 1000;
        
        vm.prank(minter);
        token.mint(user, amount);
        
        vm.prank(minter);
        token.burn(user, 500);
        
        assertEq(token.balanceOf(user), 500);
        assertEq(token.totalSupply(), 500);
    }
    
    function testLockTransfers() public {
        uint256 amount = 1000;
        
        vm.prank(minter);
        token.mint(user, amount);
        
        vm.prank(owner);
        token.lockTransfers(true);
        
        vm.expectRevert("Transfers are locked");
        vm.prank(user);
        token.transfer(address(4), 100);
        
        vm.prank(owner);
        token.lockTransfers(false);
        
        vm.prank(user);
        token.transfer(address(4), 100);
        
        assertEq(token.balanceOf(address(4)), 100);
    }
    
    function testOnlyAuthorizedMinterCanMint() public {
        vm.expectRevert("Not authorized minter");
        vm.prank(user);
        token.mint(user, 1000);
    }
}

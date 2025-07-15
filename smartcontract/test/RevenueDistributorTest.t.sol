// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {RevenueDistributor} from "../src/finance/RevenueDistributor.sol";
import {PropertyToken} from "../src/core/PropertyToken.sol";

contract RevenueDistributorTest is Test {
    RevenueDistributor public distributor;
    PropertyToken public token;
    address public owner = address(1);
    address public user1 = address(2);
    
    uint256 public constant PROPERTY_ID = 1;
    
    function setUp() public {
        vm.prank(owner);
        distributor = new RevenueDistributor();
        
        vm.prank(owner);
        token = new PropertyToken(
            "Test Property Token",
            "TPT",
            PROPERTY_ID,
            10000,
            1000 ether
        );
        
        vm.prank(owner);
        distributor.addProperty(PROPERTY_ID, address(token));
    }
    
    function testAddRevenue() public {
        uint256 revenueAmount = 10 ether;
        
        vm.deal(user1, revenueAmount);
        
        vm.prank(user1);
        distributor.addRevenue{value: revenueAmount}(PROPERTY_ID);
        
        (,, uint256 pendingRevenue,) = distributor.propertyRevenues(PROPERTY_ID);
        assertEq(pendingRevenue, revenueAmount);
    }
    
    function testDistributeRevenue() public {
        uint256 revenueAmount = 10 ether;
        
        // First mint some tokens
        vm.prank(owner);
        token.addAuthorizedMinter(owner);
        
        vm.prank(owner);
        token.mint(user1, 1000);
        
        // Add revenue
        vm.deal(address(this), revenueAmount);
        distributor.addRevenue{value: revenueAmount}(PROPERTY_ID);
        
        // Distribute revenue
        distributor.distributeRevenue(PROPERTY_ID);
        
        (,, uint256 pendingRevenue,) = distributor.propertyRevenues(PROPERTY_ID);
        assertEq(pendingRevenue, 0);
    }
    
    function testCannotAddZeroRevenue() public {
        vm.expectRevert("Revenue must be greater than 0");
        distributor.addRevenue{value: 0}(PROPERTY_ID);
    }
}
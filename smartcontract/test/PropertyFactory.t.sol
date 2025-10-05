// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";

contract PropertyFactoryTest is Test {
    PropertyFactory public factory;
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    function setUp() public {
        vm.prank(owner);
        factory = new PropertyFactory();
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function testCreateProperty() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TEST",
            1000000, // 1M total value
            10000,   // 10k shares
            100,     // 100 wei per share
            "ipfs://test",
            true,    // fractional ownership
            1000,    // rent price
            8000,    // 80% LTV
            500,     // 5% interest
            1200,    // 12% expected return
            1000     // min investment
        );

        assertEq(propertyId, 1);
        
        PropertyFactory.PropertyInfo memory info = factory.getPropertyInfo(propertyId);
        assertEq(info.name, "Test Property");
        assertEq(info.totalShares, 10000);
        assertTrue(info.isActive);
    }

    function testBuyShares() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TEST",
            1000000,
            10000,
            100,
            "ipfs://test",
            true,
            1000,
            8000,
            500,
            1200,
            1000
        );

        uint256 shares = 100;
        uint256 cost = shares * 100; // 100 wei per share
        uint256 platformFee = (cost * 250) / 10000; // 2.5% fee
        uint256 totalCost = cost + platformFee;

        vm.prank(user1);
        factory.buyShares{value: totalCost}(propertyId, shares);

        assertEq(factory.getUserShares(user1, propertyId), shares);
        
        PropertyFactory.PropertyInfo memory info = factory.getPropertyInfo(propertyId);
        assertEq(info.availableShares, 10000 - shares);
    }

    function testSellShares() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TEST",
            1000000,
            10000,
            100,
            "ipfs://test",
            true,
            1000,
            8000,
            500,
            1200,
            1000
        );

        uint256 shares = 100;
        uint256 cost = shares * 100;
        uint256 platformFee = (cost * 250) / 10000;
        uint256 totalCost = cost + platformFee;

        vm.prank(user1);
        factory.buyShares{value: totalCost}(propertyId, shares);

        uint256 balanceBefore = user1.balance;
        
        vm.prank(user1);
        factory.sellShares(propertyId, shares);

        assertEq(factory.getUserShares(user1, propertyId), 0);
        assertTrue(user1.balance > balanceBefore);
    }

    function testRentProperty() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TEST",
            1000000,
            10000,
            100,
            "ipfs://test",
            true,
            1000,
            8000,
            500,
            1200,
            1000
        );

        vm.prank(user1);
        factory.rentProperty{value: 1000}(propertyId);

        // Test passes if no revert
        assertTrue(true);
    }
}
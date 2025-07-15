// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";
import {PropertyDeed} from "../src/core/PropertyDeed.sol";
import {DeedDAO} from "../src/governace/DeedDAO.sol";
import {RevenueDistributor} from "../src/finance/RevenueDistributor.sol";
import {LoanManager} from "../src/finance/LoanManager.sol";

contract PropertyFactoryTest is Test {
    PropertyFactory public factory;
    PropertyDeed public deed;
    DeedDAO public dao;
    RevenueDistributor public distributor;
    LoanManager public loanManager;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    address public user3 = address(4);
    
    uint256 public constant PROPERTY_VALUE = 1000 ether;
    uint256 public constant TOTAL_SHARES = 10000;
    uint256 public constant PRICE_PER_SHARE = 0.1 ether;
    
    event PropertyCreated(uint256 indexed propertyId, string name, address indexed propertyToken, uint256 totalValue);
    event SharesPurchased(uint256 indexed propertyId, address indexed buyer, uint256 shares, uint256 cost);
    event SharesSold(uint256 indexed propertyId, address indexed seller, uint256 shares, uint256 proceeds);
    
    function setUp() public {
        vm.startPrank(owner);
        factory = new PropertyFactory();
        
        // Get deployed contracts from factory
        deed = factory.propertyDeed();
        dao = factory.deedDAO();
        distributor = factory.revenueDistributor();
        loanManager = factory.loanManager();
        
        vm.stopPrank();
        
        // Fund test accounts
        vm.deal(user1, 1000 ether);
        vm.deal(user2, 1000 ether);
        vm.deal(user3, 1000 ether);
    }
    
    function testCreateProperty() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        assertEq(propertyId, 1);
        
        PropertyFactory.PropertyInfo memory info = factory.getPropertyInfo(propertyId);
        assertEq(info.totalValue, PROPERTY_VALUE);
        assertEq(info.totalShares, TOTAL_SHARES);
        assertEq(info.pricePerShare, PRICE_PER_SHARE);
        assertTrue(info.isActive);
        assertTrue(info.allowsFractionalOwnership);
    }
    
    function testBuyShares() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        uint256 sharesToBuy = 1000;
        uint256 cost = sharesToBuy * PRICE_PER_SHARE;
        
        vm.expectEmit(true, true, true, true);
        emit SharesPurchased(propertyId, user1, sharesToBuy, cost);
        
        vm.prank(user1);
        factory.buyShares{value: cost}(propertyId, sharesToBuy);
        
        uint256 userShares = factory.getUserShares(user1, propertyId);
        assertEq(userShares, sharesToBuy);
        
        PropertyFactory.PropertyInfo memory info = factory.getPropertyInfo(propertyId);
        assertEq(info.availableShares, TOTAL_SHARES - sharesToBuy);
    }
    
    function testBuySharesInsufficientPayment() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        uint256 sharesToBuy = 1000;
        uint256 insufficientCost = (sharesToBuy * PRICE_PER_SHARE) - 1 ether;
        
        vm.expectRevert("Insufficient payment");
        vm.prank(user1);
        factory.buyShares{value: insufficientCost}(propertyId, sharesToBuy);
    }
    
    function testSellShares() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        uint256 sharesToBuy = 1000;
        uint256 cost = sharesToBuy * PRICE_PER_SHARE;
        
        vm.prank(user1);
        factory.buyShares{value: cost}(propertyId, sharesToBuy);
        
        uint256 sharesToSell = 500;
        uint256 proceeds = sharesToSell * PRICE_PER_SHARE;
        uint256 balanceBefore = user1.balance;
        
        vm.expectEmit(true, true, true, true);
        emit SharesSold(propertyId, user1, sharesToSell, proceeds);
        
        vm.prank(user1);
        factory.sellShares(propertyId, sharesToSell);
        
        assertEq(user1.balance, balanceBefore + proceeds);
        assertEq(factory.getUserShares(user1, propertyId), sharesToBuy - sharesToSell);
    }
    
    function testLoanEligibility() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        // Buy 50% or more shares to be eligible for loan
        uint256 sharesToBuy = 5000; // 50%
        uint256 cost = sharesToBuy * PRICE_PER_SHARE;
        
        vm.prank(user1);
        factory.buyShares{value: cost}(propertyId, sharesToBuy);
        
        // Check if loan initiated event was emitted
        // This would trigger loan eligibility in real implementation
    }
    
    function testRentProperty() public {
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        uint256 rentAmount = 10 ether;
        
        vm.prank(user1);
        factory.rentProperty{value: rentAmount}(propertyId);
        
        // Check that revenue was added to distributor
        // In real implementation, you'd check distributor balance
    }
    
    function testOnlyOwnerCanCreateProperty() public {
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user1);
        factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
    }
    
    function testPauseUnpause() public {
        vm.prank(owner);
        factory.pause();
        
        vm.expectRevert("Pausable: paused");
        vm.prank(owner);
        factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        vm.prank(owner);
        factory.unpause();
        
        // Should work after unpause
        vm.prank(owner);
        uint256 propertyId = factory.createProperty(
            "Test Property",
            "TP",
            PROPERTY_VALUE,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            "ipfs://test-metadata",
            true
        );
        
        assertEq(propertyId, 1);
    }
}
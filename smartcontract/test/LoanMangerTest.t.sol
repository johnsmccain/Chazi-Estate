// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {LoanManager} from "../src/finance/LoanManager.sol";
import {PropertyDeed} from "../src/core/PropertyDeed.sol";

contract LoanManagerTest is Test {
    LoanManager public loanManager;
    PropertyDeed public deed;
    address public owner = address(1);
    address public borrower = address(2);
    
    uint256 public constant PROPERTY_ID = 1;
    uint256 public constant LOAN_AMOUNT = 500 ether;
    uint256 public constant INTEREST_RATE = 500; // 5%
    uint256 public constant DURATION = 365 days;
    
    function setUp() public {
        vm.prank(owner);
        deed = new PropertyDeed();
        
        vm.prank(owner);
        loanManager = new LoanManager(address(deed));
        
        vm.deal(borrower, 1000 ether);
    }
    
    function testCreateLoan() public {
        vm.prank(owner);
        uint256 loanId = loanManager.createLoan(
            PROPERTY_ID,
            borrower,
            LOAN_AMOUNT,
            INTEREST_RATE,
            DURATION
        );
        
        assertEq(loanId, 1);
        
        (
            uint256 propertyId,
            address loanBorrower,
            uint256 loanAmount,
            uint256 paidAmount,
            uint256 interestRate,
            uint256 duration,
            uint256 startTime,
            bool isActive,
            bool isFullyPaid
        ) = loanManager.loans(loanId);
        
        assertEq(propertyId, PROPERTY_ID);
        assertEq(loanBorrower, borrower);
        assertEq(loanAmount, LOAN_AMOUNT);
        assertEq(paidAmount, 0);
        assertEq(interestRate, INTEREST_RATE);
        assertEq(duration, DURATION);
        assertTrue(isActive);
        assertFalse(isFullyPaid);
    }
    
    function testMakePayment() public {
        vm.prank(owner);
        uint256 loanId = loanManager.createLoan(
            PROPERTY_ID,
            borrower,
            LOAN_AMOUNT,
            INTEREST_RATE,
            DURATION
        );
        
        uint256 paymentAmount = 100 ether;
        
        vm.prank(borrower);
        loanManager.makePayment{value: paymentAmount}(loanId);
        
        (,,, uint256 paidAmount,,,,,) = loanManager.loans(loanId);
        assertEq(paidAmount, paymentAmount);
    }
    
    function testCalculateTotalOwed() public {
        vm.prank(owner);
        uint256 loanId = loanManager.createLoan(
            PROPERTY_ID,
            borrower,
            LOAN_AMOUNT,
            INTEREST_RATE,
            DURATION
        );
        
        uint256 totalOwed = loanManager.calculateTotalOwed(loanId);
        uint256 expectedInterest = (LOAN_AMOUNT * INTEREST_RATE) / 10000;
        uint256 expectedTotal = LOAN_AMOUNT + expectedInterest;
        
        assertEq(totalOwed, expectedTotal);
    }
    
    function testCheckLoanDefault() public {
        vm.prank(owner);
        uint256 loanId = loanManager.createLoan(
            PROPERTY_ID,
            borrower,
            LOAN_AMOUNT,
            INTEREST_RATE,
            DURATION
        );
        
        // Initially not in default
        assertFalse(loanManager.checkLoanDefault(loanId));
        
        // Fast forward past loan duration
        vm.warp(block.timestamp + DURATION + 1);
        
        // Now should be in default
        assertTrue(loanManager.checkLoanDefault(loanId));
    }
}
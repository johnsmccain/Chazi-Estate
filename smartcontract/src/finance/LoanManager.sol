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
import {PropertyDeed} from "../core/PropertyDeed.sol";



// ============================================================================
// LOAN MANAGER
// ============================================================================

contract LoanManager is Ownable, ReentrancyGuard {
    using Math for uint256;
    
    struct Loan {
        uint256 propertyId;
        address borrower;
        uint256 loanAmount;
        uint256 paidAmount;
        uint256 interestRate; // basis points (e.g., 500 = 5%)
        uint256 duration; // in seconds
        uint256 startTime;
        bool isActive;
        bool isFullyPaid;
    }
    
    mapping(uint256 => Loan) public loans; // loanId => Loan
    mapping(uint256 => uint256) public propertyLoans; // propertyId => loanId
    uint256 public nextLoanId = 1;
    
    PropertyDeed public immutable propertyDeed;
    
    event LoanCreated(uint256 indexed loanId, uint256 indexed propertyId, address indexed borrower, uint256 amount);
    event LoanPayment(uint256 indexed loanId, uint256 amount, uint256 totalPaid);
    event LoanFullyPaid(uint256 indexed loanId, uint256 indexed propertyId);
    event LoanDefaulted(uint256 indexed loanId, uint256 indexed propertyId);
    
    constructor(address _propertyDeed) Ownable(msg.sender){
        propertyDeed = PropertyDeed(_propertyDeed);
    }
    
    function createLoan(
        uint256 propertyId,
        address borrower,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration
    ) external onlyOwner returns (uint256) {
        require(propertyLoans[propertyId] == 0, "Property already has active loan");
        
        uint256 loanId = nextLoanId++;
        
        loans[loanId] = Loan({
            propertyId: propertyId,
            borrower: borrower,
            loanAmount: loanAmount,
            paidAmount: 0,
            interestRate: interestRate,
            duration: duration,
            startTime: block.timestamp,
            isActive: true,
            isFullyPaid: false
        });
        
        propertyLoans[propertyId] = loanId;
        
        emit LoanCreated(loanId, propertyId, borrower, loanAmount);
        return loanId;
    }
    
    function makePayment(uint256 loanId) external payable nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.isActive, "Loan not active");
        require(msg.sender == loan.borrower, "Not loan borrower");
        require(msg.value > 0, "Payment must be greater than 0");
        
        loan.paidAmount = loan.paidAmount + msg.value;
        
        emit LoanPayment(loanId, msg.value, loan.paidAmount);
        
        // Check if loan is fully paid
        uint256 totalOwed = calculateTotalOwed(loanId);
        if (loan.paidAmount >= totalOwed) {
            loan.isFullyPaid = true;
            loan.isActive = false;
            propertyLoans[loan.propertyId] = 0;
            
            // Transfer property deed to borrower
            propertyDeed.safeTransferFrom(address(this), loan.borrower, loan.propertyId);
            
            emit LoanFullyPaid(loanId, loan.propertyId);
        }
    }
    
    function calculateTotalOwed(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        uint256 interest = (loan.loanAmount * loan.interestRate) /(10000);
        return loan.loanAmount + interest;
    }
    
    function checkLoanDefault(uint256 loanId) public view returns (bool) {
        Loan memory loan = loans[loanId];
        return loan.isActive && (block.timestamp > loan.startTime + loan.duration);
    }
    
    function handleDefault(uint256 loanId) external onlyOwner {
        require(checkLoanDefault(loanId), "Loan not in default");
        
        Loan storage loan = loans[loanId];
        loan.isActive = false;
        propertyLoans[loan.propertyId] = 0;
        
        emit LoanDefaulted(loanId, loan.propertyId);
    }
}
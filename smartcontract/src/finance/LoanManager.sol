// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract LoanManager is Ownable, ReentrancyGuard {
    struct Loan {
        uint256 id;
        uint256 propertyId;
        address borrower;
        uint256 principal;
        uint256 interestRate;
        uint256 duration;
        uint256 startTime;
        uint256 totalPaid;
        bool isActive;
        bool isDefaulted;
    }

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoans;
    
    IERC721 public propertyDeed;
    uint256 public nextLoanId = 1;
    uint256 public constant MAX_LTV = 8000; // 80%
    uint256 public constant MIN_DURATION = 30 days;
    uint256 public constant MAX_DURATION = 365 days;

    event LoanCreated(uint256 indexed loanId, uint256 indexed propertyId, address borrower, uint256 amount);
    event PaymentMade(uint256 indexed loanId, address borrower, uint256 amount);
    event LoanDefaulted(uint256 indexed loanId);
    event LoanRepaid(uint256 indexed loanId);

    constructor(address _propertyDeed) Ownable(msg.sender) {
        propertyDeed = IERC721(_propertyDeed);
    }

    function createLoan(
        uint256 propertyId,
        uint256 amount,
        uint256 duration
    ) external returns (uint256) {
        require(propertyDeed.ownerOf(propertyId) == msg.sender, "Not property owner");
        require(duration >= MIN_DURATION && duration <= MAX_DURATION, "Invalid duration");
        require(amount > 0, "Invalid loan amount");

        uint256 loanId = nextLoanId++;
        
        loans[loanId] = Loan({
            id: loanId,
            propertyId: propertyId,
            borrower: msg.sender,
            principal: amount,
            interestRate: 500, // 5% annual
            duration: duration,
            startTime: block.timestamp,
            totalPaid: 0,
            isActive: true,
            isDefaulted: false
        });

        userLoans[msg.sender].push(loanId);

        // Transfer loan amount to borrower
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Loan transfer failed");

        emit LoanCreated(loanId, propertyId, msg.sender, amount);
        return loanId;
    }

    function makePayment(uint256 loanId, uint256 amount) external payable {
        Loan storage loan = loans[loanId];
        require(loan.isActive, "Loan not active");
        require(msg.sender == loan.borrower, "Not borrower");
        require(msg.value >= amount, "Insufficient payment");

        loan.totalPaid += amount;

        uint256 totalOwed = calculateTotalOwed(loanId);
        if (loan.totalPaid >= totalOwed) {
            loan.isActive = false;
            emit LoanRepaid(loanId);
        }

        // Refund excess payment
        if (msg.value > amount) {
            (bool success, ) = msg.sender.call{value: msg.value - amount}("");
            require(success, "Refund failed");
        }

        emit PaymentMade(loanId, msg.sender, amount);
    }

    function calculateTotalOwed(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        if (!loan.isActive) return 0;

        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 interest = (loan.principal * loan.interestRate * timeElapsed) / (10000 * 365 days);
        
        return loan.principal + interest - loan.totalPaid;
    }

    function checkLoanDefault(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.isActive, "Loan not active");
        
        if (block.timestamp > loan.startTime + loan.duration) {
            uint256 totalOwed = calculateTotalOwed(loanId);
            if (loan.totalPaid < totalOwed) {
                loan.isDefaulted = true;
                loan.isActive = false;
                emit LoanDefaulted(loanId);
            }
        }
    }

    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    function getUserLoans(address user) external view returns (uint256[] memory) {
        return userLoans[user];
    }

    receive() external payable {}
}
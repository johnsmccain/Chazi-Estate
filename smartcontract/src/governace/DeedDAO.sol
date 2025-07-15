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
// DAO CONTRACT
// ============================================================================
contract DeedDAO is Ownable, ReentrancyGuard {
    
    enum ProposalType { RENT_PROPERTY, SELL_PROPERTY, CHANGE_MANAGER, CHANGE_RULES }
    enum ProposalStatus { PENDING, ACTIVE, SUCCEEDED, FAILED, EXECUTED }
    
    struct Proposal {
        uint256 id;
        uint256 propertyId;
        address proposer;
        string description;
        ProposalType proposalType;
        ProposalStatus status;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => address) public propertyTokens;
    uint256 public nextProposalId = 1;
    
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant VOTING_DELAY = 1 days;
    uint256 public constant QUORUM_PERCENTAGE = 25; // 25%
    
    event ProposalCreated(uint256 indexed proposalId, uint256 indexed propertyId, address indexed proposer, ProposalType proposalType);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    
    function addProperty(uint256 propertyId, address propertyToken) external onlyOwner {
        propertyTokens[propertyId] = propertyToken;
    }
    
    constructor() Ownable(msg.sender) {}
    function createProposal(
        uint256 propertyId,
        string calldata description,
        uint8 proposalType
    ) external returns (uint256) {
        require(hasVotingPower(msg.sender, propertyId), "No voting power");
        require(proposalType <= uint8(ProposalType.CHANGE_RULES), "Invalid proposal type");
        
        uint256 proposalId = nextProposalId++;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.propertyId = propertyId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.proposalType = ProposalType(proposalType);
        proposal.status = ProposalStatus.PENDING;
        proposal.startTime = block.timestamp + VOTING_DELAY;
        proposal.endTime = block.timestamp + VOTING_DELAY + VOTING_PERIOD;
        
        emit ProposalCreated(proposalId, propertyId, msg.sender, ProposalType(proposalType));
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.PENDING || proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(hasVotingPower(msg.sender, proposal.propertyId), "No voting power");
        
        if (proposal.status == ProposalStatus.PENDING) {
            proposal.status = ProposalStatus.ACTIVE;
        }
        
        IPropertyToken token = IPropertyToken(propertyTokens[proposal.propertyId]);
        uint256 votingPower = token.balanceOf(msg.sender);
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes = proposal.forVotes + votingPower;
        } else {
            proposal.againstVotes = proposal.againstVotes + votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
        
        _updateProposalStatus(proposalId);
    }
    
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.SUCCEEDED, "Proposal not succeeded");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        
        // Execute based on proposal type
        if (proposal.proposalType == ProposalType.RENT_PROPERTY) {
            _executeRentProposal(proposal.propertyId);
        } else if (proposal.proposalType == ProposalType.SELL_PROPERTY) {
            _executeSellProposal(proposal.propertyId);
        }
        // Add other execution logic as needed
        
        emit ProposalExecuted(proposalId);
    }
    
    function hasVotingPower(address user, uint256 propertyId) public view returns (bool) {
        address tokenAddress = propertyTokens[propertyId];
        if (tokenAddress == address(0)) return false;
        
        IPropertyToken token = IPropertyToken(tokenAddress);
        return token.balanceOf(user) > 0;
    }
    
    function _updateProposalStatus(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        
        if (block.timestamp > proposal.endTime) {
            IPropertyToken token = IPropertyToken(propertyTokens[proposal.propertyId]);
            uint256 totalSupply = token.totalSupply();
            uint256 quorum = (totalSupply * QUORUM_PERCENTAGE) / 100;
            
            uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
            
            if (totalVotes >= quorum && proposal.forVotes > proposal.againstVotes) {
                proposal.status = ProposalStatus.SUCCEEDED;
            } else {
                proposal.status = ProposalStatus.FAILED;
            }
        }
    }
    
    function _executeRentProposal(uint256 propertyId) internal {
        // Implementation for enabling property rental
    }
    
    function _executeSellProposal(uint256 propertyId) internal {
        // Implementation for property sale
    }
    
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        uint256 propertyId,
        address proposer,
        string memory description,
        ProposalType proposalType,
        ProposalStatus status,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.propertyId,
            proposal.proposer,
            proposal.description,
            proposal.proposalType,
            proposal.status,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }
}

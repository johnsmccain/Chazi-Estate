// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IPropertyToken} from "../interfaces/IPropertyToken.sol";

contract DeedDAO is Ownable, ReentrancyGuard {
    struct Proposal {
        uint256 id;
        uint256 propertyId;
        string description;
        uint256 votingDeadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        bool active;
        address proposer;
        uint256 createdAt;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => address) public propertyTokens;
    
    uint256 public nextProposalId = 1;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTING_POWER = 100; // Minimum shares to vote

    event ProposalCreated(uint256 indexed proposalId, uint256 indexed propertyId, address proposer);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event PropertyAdded(uint256 indexed propertyId, address tokenContract);

    constructor() Ownable(msg.sender) {}

    function addProperty(uint256 propertyId, address tokenContract) external onlyOwner {
        propertyTokens[propertyId] = tokenContract;
        emit PropertyAdded(propertyId, tokenContract);
    }

    function createProposal(
        uint256 propertyId,
        string calldata description,
        uint256 votingDuration
    ) external returns (uint256) {
        require(propertyTokens[propertyId] != address(0), "Property not registered");
        require(hasVotingPower(msg.sender, propertyId), "Insufficient voting power");
        
        uint256 proposalId = nextProposalId++;
        uint256 deadline = block.timestamp + (votingDuration > 0 ? votingDuration : VOTING_PERIOD);
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            propertyId: propertyId,
            description: description,
            votingDeadline: deadline,
            yesVotes: 0,
            noVotes: 0,
            executed: false,
            active: true,
            proposer: msg.sender,
            createdAt: block.timestamp
        });

        emit ProposalCreated(proposalId, propertyId, msg.sender);
        return proposalId;
    }

    function vote(uint256 proposalId, bool support) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.active, "Proposal not active");
        require(block.timestamp <= proposal.votingDeadline, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(hasVotingPower(msg.sender, proposal.propertyId), "No voting power");

        uint256 votingWeight = getVotingPower(msg.sender, proposal.propertyId);
        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.yesVotes += votingWeight;
        } else {
            proposal.noVotes += votingWeight;
        }

        emit VoteCast(proposalId, msg.sender, support, votingWeight);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.active, "Proposal not active");
        require(block.timestamp > proposal.votingDeadline, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.yesVotes > proposal.noVotes, "Proposal rejected");

        proposal.executed = true;
        proposal.active = false;

        emit ProposalExecuted(proposalId);
    }

    function hasVotingPower(address user, uint256 propertyId) public view returns (bool) {
        address tokenContract = propertyTokens[propertyId];
        if (tokenContract == address(0)) return false;
        
        return IPropertyToken(tokenContract).getUserShares(user, propertyId) >= MIN_VOTING_POWER;
    }

    function getVotingPower(address user, uint256 propertyId) public view returns (uint256) {
        address tokenContract = propertyTokens[propertyId];
        if (tokenContract == address(0)) return 0;
        
        return IPropertyToken(tokenContract).getUserShares(user, propertyId);
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }
}
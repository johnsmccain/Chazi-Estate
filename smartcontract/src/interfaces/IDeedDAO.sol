// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDeedDAO {
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

    function createProposal(uint256 propertyId, string calldata description, uint256 votingDuration) external returns (uint256);
    function vote(uint256 proposalId, bool support) external;
    function executeProposal(uint256 proposalId) external;
    function hasVotingPower(address user, uint256 propertyId) external view returns (bool);
    function getVotingPower(address user, uint256 propertyId) external view returns (uint256);
    function getProposal(uint256 proposalId) external view returns (Proposal memory);
}
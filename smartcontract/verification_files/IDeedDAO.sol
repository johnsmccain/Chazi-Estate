// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDeedDAO {
    function hasVotingPower(address user, uint256 propertyId) external view returns (bool);
    function createProposal(uint256 propertyId, string calldata description, uint8 proposalType) external returns (uint256);
    function vote(uint256 proposalId, bool support) external;
    function executeProposal(uint256 proposalId) external;
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {DeedDAO} from "../src/governace/DeedDAO.sol";
import {PropertyToken} from "../src/core/PropertyToken.sol";

contract DeedDAOTest is Test {
    DeedDAO public dao;
    PropertyToken public token;
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    uint256 public constant PROPERTY_ID = 1;
    
    function setUp() public {
        vm.prank(owner);
        dao = new DeedDAO();
        
        vm.prank(owner);
        token = new PropertyToken();
        
        vm.prank(owner);
        token.addAuthorizedMinter(owner);
        vm.prank(owner);
        token.addAuthorizedOperator(owner);
        
        // Create a property first
        vm.prank(owner);
        (uint256 propertyId, uint256 tokenId) = token.createProperty(
            "Test Property",
            "TPT",
            10000, // total shares
            1000 ether, // price per share
            10000000 ether, // property value
            "https://example.com/metadata"
        );
        
        vm.prank(owner);
        dao.addProperty(PROPERTY_ID, address(token));
        
        // Give users some tokens for voting
        vm.prank(owner);
        token.mintShares(PROPERTY_ID, user1, 3000, 3000 * 1000 ether);
        
        vm.prank(owner);
        token.mintShares(PROPERTY_ID, user2, 2000, 2000 * 1000 ether);
    }
    
    function testCreateProposal() public {
        vm.prank(user1);
        uint256 proposalId = dao.createProposal(
            PROPERTY_ID,
            "Rent out the property",
            uint8(DeedDAO.ProposalType.RENT_PROPERTY)
        );
        
        assertEq(proposalId, 1);
        
        (
            uint256 id,
            uint256 propertyId,
            address proposer,
            string memory description,
            DeedDAO.ProposalType proposalType,
            DeedDAO.ProposalStatus status,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 startTime,
            uint256 endTime,
            bool executed
        ) = dao.getProposal(proposalId);
        
        assertEq(id, proposalId);
        assertEq(propertyId, PROPERTY_ID);
        assertEq(proposer, user1);
        assertEq(uint8(proposalType), uint8(DeedDAO.ProposalType.RENT_PROPERTY));
        assertEq(uint8(status), uint8(DeedDAO.ProposalStatus.PENDING));
        assertFalse(executed);
    }
    
    function testVoteOnProposal() public {
        vm.prank(user1);
        uint256 proposalId = dao.createProposal(
            PROPERTY_ID,
            "Rent out the property",
            uint8(DeedDAO.ProposalType.RENT_PROPERTY)
        );
        
        // Fast forward to voting period
        vm.warp(block.timestamp + 1 days + 1);
        
        vm.prank(user1);
        dao.vote(proposalId, true);
        
        vm.prank(user2);
        dao.vote(proposalId, false);
        
        (,,,,,, uint256 forVotes, uint256 againstVotes,,, ) = dao.getProposal(proposalId);
        
        assertEq(forVotes, 3000); // user1's tokens
        assertEq(againstVotes, 2000); // user2's tokens
    }
    
    function testCannotVoteWithoutTokens() public {
        vm.prank(user1);
        uint256 proposalId = dao.createProposal(
            PROPERTY_ID,
            "Rent out the property",
            uint8(DeedDAO.ProposalType.RENT_PROPERTY)
        );
        
        vm.warp(block.timestamp + 1 days + 1);
        
        vm.expectRevert("No voting power");
        vm.prank(address(5)); // User without tokens
        dao.vote(proposalId, true);
    }
    
    function testCannotCreateProposalWithoutTokens() public {
        vm.expectRevert("No voting power");
        vm.prank(address(5)); // User without tokens
        dao.createProposal(
            PROPERTY_ID,
            "Test proposal",
            uint8(DeedDAO.ProposalType.RENT_PROPERTY)
        );
    }
    
    // Fuzz tests
    function testFuzz_CreateProposal(uint256 userShares, uint8 proposalType) public {
        vm.assume(userShares > 0 && userShares <= 10000);
        vm.assume(proposalType <= uint8(DeedDAO.ProposalType.CHANGE_RULES));
        
        // Check if we have enough available shares
        vm.assume(userShares <= 10000 - 5000); // Leave room for existing shares
        
        // Give user some shares
        vm.prank(owner);
        token.mintShares(PROPERTY_ID, user1, userShares, userShares * 1000 ether);
        
        vm.prank(user1);
        uint256 proposalId = dao.createProposal(
            PROPERTY_ID,
            "Fuzz test proposal",
            proposalType
        );
        
        assertEq(proposalId, 1);
        
        (uint256 id, uint256 propertyId, address proposer, , DeedDAO.ProposalType pType, DeedDAO.ProposalStatus status, , , , , ) = dao.getProposal(proposalId);
        
        assertEq(id, proposalId);
        assertEq(propertyId, PROPERTY_ID);
        assertEq(proposer, user1);
        assertEq(uint8(pType), proposalType);
        assertEq(uint8(status), uint8(DeedDAO.ProposalStatus.PENDING));
    }
    
    function testFuzz_VoteOnProposal(uint256 user1Shares, uint256 user2Shares, bool support) public {
        vm.assume(user1Shares > 0 && user1Shares <= 2500);
        vm.assume(user2Shares > 0 && user2Shares <= 2500);
        vm.assume(user1Shares + user2Shares <= 5000); // Total doesn't exceed available shares
        
        // Use fresh users to avoid existing shares
        address freshUser1 = address(0x777);
        address freshUser2 = address(0x888);
        
        // Give users shares
        vm.prank(owner);
        token.mintShares(PROPERTY_ID, freshUser1, user1Shares, user1Shares * 1000 ether);
        vm.prank(owner);
        token.mintShares(PROPERTY_ID, freshUser2, user2Shares, user2Shares * 1000 ether);
        
        // Create proposal
        vm.prank(freshUser1);
        uint256 proposalId = dao.createProposal(
            PROPERTY_ID,
            "Fuzz test proposal",
            uint8(DeedDAO.ProposalType.RENT_PROPERTY)
        );
        
        // Fast forward to voting period
        vm.warp(block.timestamp + 1 days + 1);
        
        // Vote
        vm.prank(freshUser1);
        dao.vote(proposalId, support);
        
        vm.prank(freshUser2);
        dao.vote(proposalId, !support);
        
        (,,,,,, uint256 forVotes, uint256 againstVotes,,, ) = dao.getProposal(proposalId);
        
        if (support) {
            assertEq(forVotes, user1Shares);
            assertEq(againstVotes, user2Shares);
        } else {
            assertEq(forVotes, user2Shares);
            assertEq(againstVotes, user1Shares);
        }
    }
    
    function testFuzz_HasVotingPower(uint256 shares) public {
        vm.assume(shares <= 5000); // Leave room for existing shares
        
        // Use a fresh user for this test to avoid existing shares
        address freshUser = address(0x999);
        
        if (shares > 0) {
            vm.prank(owner);
            token.mintShares(PROPERTY_ID, freshUser, shares, shares * 1000 ether);
            assertTrue(dao.hasVotingPower(freshUser, PROPERTY_ID));
        } else {
            // For shares = 0, fresh user should not have voting power
            assertFalse(dao.hasVotingPower(freshUser, PROPERTY_ID));
        }
    }
}
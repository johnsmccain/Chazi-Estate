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
        token = new PropertyToken(
            "Test Property Token",
            "TPT",
            PROPERTY_ID,
            10000,
            1000 ether
        );
        
        vm.prank(owner);
        token.addAuthorizedMinter(owner);
        
        vm.prank(owner);
        dao.addProperty(PROPERTY_ID, address(token));
        
        // Give users some tokens for voting
        vm.prank(owner);
        token.mint(user1, 3000);
        
        vm.prank(owner);
        token.mint(user2, 2000);
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
}
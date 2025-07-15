// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";
import {DeedDAO} from "../src/governace/DeedDAO.sol";


// Script for interacting with deployed contracts (testing/demo purposes)
contract InteractWithDeedAI is Script {
    function run() external {
        string memory network = vm.envString("NETWORK");
        string memory fileName = string.concat("deployments/", network, ".json");
        string memory json = vm.readFile(fileName);
        
        address factoryAddress = vm.parseJsonAddress(json, ".PropertyFactory");
        address daoAddress = vm.parseJsonAddress(json, ".DeedDAO");
        
        PropertyFactory factory = PropertyFactory(factoryAddress);
        DeedDAO dao = DeedDAO(daoAddress);
        
        vm.startBroadcast();
        
        // Example: Buy shares in property 1
        uint256 propertyId = 1;
        uint256 sharesToBuy = 100; // Buy 100 shares
        uint256 cost = sharesToBuy * 100; // 100 shares * $100 = $10,000
        
        factory.buyShares{value: cost}(propertyId, sharesToBuy);
        console.log("Purchased", sharesToBuy, "shares in property", propertyId);
        
        // Example: Create a DAO proposal
        uint256 proposalId = dao.createProposal(
            propertyId,
            "Proposal to increase rent by 10%",
            0 // RENT_PROPERTY
        );
        console.log("Created DAO proposal with ID:", proposalId);
        
        // Example: Vote on the proposal
        dao.vote(proposalId, true); // Vote in favor
        console.log("Voted in favor of proposal", proposalId);
        
        vm.stopBroadcast();
        
        console.log("Interaction completed!");
    }
}
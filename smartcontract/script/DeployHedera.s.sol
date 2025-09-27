// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";

contract DeployHedera is Script {
    function run() external {
        console.log("Deploying chazi-chain contracts to Hedera Testnet...");
        console.log("Chain ID:", block.chainid);
        console.log("Block number:", block.number);
        
        // Start broadcasting transactions
        vm.startBroadcast();
        
        // Deploy the main PropertyFactory contract
        // This will automatically deploy all other contracts
        PropertyFactory factory = new PropertyFactory();
        
        console.log("PropertyFactory deployed at:", address(factory));
        console.log("PropertyDeed deployed at:", address(factory.propertyDeed()));
        console.log("DeedDAO deployed at:", address(factory.deedDAO()));
        console.log("RevenueDistributor deployed at:", address(factory.revenueDistributor()));
        console.log("LoanManager deployed at:", address(factory.loanManager()));
        
        vm.stopBroadcast();
        
        console.log("Deployment completed successfully!");
        console.log("Network: Hedera Testnet (Chain ID: 296)");
        console.log("RPC URL: https://testnet.hashio.io/api");
    }
}

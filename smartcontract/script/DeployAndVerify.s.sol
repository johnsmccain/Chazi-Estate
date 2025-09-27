// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";

contract DeployAndVerify is Script {
    function run() external {
        console.log("=== chazi-chain Contract Deployment and Verification ===");
        console.log("Network: Hedera Testnet");
        console.log("Chain ID:", block.chainid);
        console.log("Block number:", block.number);
        console.log("Deployer:", msg.sender);
        
        // Start broadcasting transactions
        vm.startBroadcast();
        
        // Deploy the main PropertyFactory contract
        console.log("\n1. Deploying PropertyFactory...");
        PropertyFactory factory = new PropertyFactory();
        
        console.log("PropertyFactory deployed at:", address(factory));
        console.log("PropertyDeed deployed at:", address(factory.propertyDeed()));
        console.log("PropertyToken deployed at:", address(factory.propertyToken()));
        console.log("DeedDAO deployed at:", address(factory.deedDAO()));
        console.log("RevenueDistributor deployed at:", address(factory.revenueDistributor()));
        console.log("LoanManager deployed at:", address(factory.loanManager()));
        
        vm.stopBroadcast();
        
        // Display verification information
        console.log("\n=== VERIFICATION INFORMATION ===");
        console.log("Contract Addresses:");
        console.log("PropertyFactory:   ", address(factory));
        console.log("PropertyDeed:      ", address(factory.propertyDeed()));
        console.log("PropertyToken:     ", address(factory.propertyToken()));
        console.log("DeedDAO:           ", address(factory.deedDAO()));
        console.log("RevenueDistributor:", address(factory.revenueDistributor()));
        console.log("LoanManager:       ", address(factory.loanManager()));
        
        console.log("\n=== VERIFICATION COMMANDS ===");
        console.log("Run these commands to verify contracts:");
        console.log("");
        console.log("# PropertyFactory");
        console.log("forge verify-contract", address(factory), "src/core/PropertyFactory.sol:PropertyFactory \\");
        console.log("  --rpc-url https://testnet.hashio.io/api \\");
        console.log("  --compiler-version 0.8.28 \\");
        console.log("  --num-of-optimizations 200 \\");
        console.log("  --via-ir \\");
        console.log("  --watch");
        console.log("");
        console.log("# PropertyDeed");
        console.log("forge verify-contract", address(factory.propertyDeed()), "src/core/PropertyDeed.sol:PropertyDeed \\");
        console.log("  --rpc-url https://testnet.hashio.io/api \\");
        console.log("  --compiler-version 0.8.28 \\");
        console.log("  --num-of-optimizations 200 \\");
        console.log("  --via-ir \\");
        console.log("  --watch");
        console.log("");
        console.log("# PropertyToken");
        console.log("forge verify-contract", address(factory.propertyToken()), "src/core/PropertyToken.sol:PropertyToken \\");
        console.log("  --rpc-url https://testnet.hashio.io/api \\");
        console.log("  --compiler-version 0.8.28 \\");
        console.log("  --num-of-optimizations 200 \\");
        console.log("  --via-ir \\");
        console.log("  --watch");
        console.log("");
        console.log("# DeedDAO");
        console.log("forge verify-contract", address(factory.deedDAO()), "src/governace/DeedDAO.sol:DeedDAO \\");
        console.log("  --rpc-url https://testnet.hashio.io/api \\");
        console.log("  --compiler-version 0.8.28 \\");
        console.log("  --num-of-optimizations 200 \\");
        console.log("  --via-ir \\");
        console.log("  --watch");
        console.log("");
        console.log("# RevenueDistributor");
        console.log("forge verify-contract", address(factory.revenueDistributor()), "src/finance/RevenueDistributor.sol:RevenueDistributor \\");
        console.log("  --rpc-url https://testnet.hashio.io/api \\");
        console.log("  --compiler-version 0.8.28 \\");
        console.log("  --num-of-optimizations 200 \\");
        console.log("  --via-ir \\");
        console.log("  --watch");
        console.log("");
        console.log("# LoanManager");
        console.log("forge verify-contract", address(factory.loanManager()), "src/finance/LoanManager.sol:LoanManager \\");
        console.log("  --rpc-url https://testnet.hashio.io/api \\");
        console.log("  --compiler-version 0.8.28 \\");
        console.log("  --num-of-optimizations 200 \\");
        console.log("  --via-ir \\");
        console.log("  --watch");
        
        console.log("\n=== MANUAL VERIFICATION ===");
        console.log("Alternatively, verify manually at: https://hashscan.io/testnet");
        console.log("Search for each contract address and follow the verification process.");
        
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("All contracts deployed successfully to Hedera Testnet!");
        console.log("Network: Hedera Testnet (Chain ID: 296)");
        console.log("RPC URL: https://testnet.hashio.io/api");
        console.log("Explorer: https://hashscan.io/testnet");
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";

// Utility script for contract verification on Etherscan
contract VerifyContracts is Script {
    function run() external {
        string memory network = vm.envString("NETWORK");
        string memory fileName = string.concat("deployments/", network, ".json");
        string memory json = vm.readFile(fileName);
        
        address factoryAddress = vm.parseJsonAddress(json, ".PropertyFactory");
        address deedAddress = vm.parseJsonAddress(json, ".PropertyDeed");
        address daoAddress = vm.parseJsonAddress(json, ".DeedDAO");
        address distributorAddress = vm.parseJsonAddress(json, ".RevenueDistributor");
        address loanAddress = vm.parseJsonAddress(json, ".LoanManager");
        
        console.log("Verify these contracts on Etherscan:");
        console.log("PropertyFactory:", factoryAddress);
        console.log("PropertyDeed:", deedAddress);
        console.log("DeedDAO:", daoAddress);
        console.log("RevenueDistributor:", distributorAddress);
        console.log("LoanManager:", loanAddress);
        
        console.log("\nExample verification commands:");
        console.log("forge verify-contract", factoryAddress, "src/PropertyFactory.sol:PropertyFactory --chain", network);
        console.log("forge verify-contract", deedAddress, "src/PropertyFactory.sol:PropertyDeed --chain", network);
        console.log("forge verify-contract", daoAddress, "src/PropertyFactory.sol:DeedDAO --chain", network);
        console.log("forge verify-contract", distributorAddress, "src/PropertyFactory.sol:RevenueDistributor --chain", network);
        console.log("forge verify-contract", loanAddress, "src/PropertyFactory.sol:LoanManager --chain", network);
    }
}
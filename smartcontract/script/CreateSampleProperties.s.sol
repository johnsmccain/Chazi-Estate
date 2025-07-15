// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";



// Additional deployment script for creating sample properties
contract CreateSampleProperties is Script {
    function run() external {
        string memory network = vm.envString("NETWORK");
        string memory fileName = string.concat("deployments/", network, ".json");
        string memory json = vm.readFile(fileName);
        
        address factoryAddress = vm.parseJsonAddress(json, ".PropertyFactory");
        PropertyFactory factory = PropertyFactory(factoryAddress);
        
        vm.startBroadcast();
        
        // Create sample property 1: Luxury Apartment
        uint256 property1 = factory.createProperty(
            "DeedAI Luxury Apartment #1",
            "DEED-APT1",
            1000000, // 1M USD value
            10000,   // 10k shares
            100,     // $100 per share
            "https://metadata.deedai.com/properties/1",
            true     // Allows fractional ownership
        );
        
        console.log("Created property 1 (Luxury Apartment) with ID:", property1);
        
        // Create sample property 2: Commercial Building
        uint256 property2 = factory.createProperty(
            "DeedAI Commercial Building #1",
            "DEED-COM1",
            5000000, // 5M USD value
            50000,   // 50k shares
            100,     // $100 per share
            "https://metadata.deedai.com/properties/2",
            true     // Allows fractional ownership
        );
        
        console.log("Created property 2 (Commercial Building) with ID:", property2);
        
        // Create sample property 3: Single Family Home
        uint256 property3 = factory.createProperty(
            "DeedAI Family Home #1",
            "DEED-HOME1",
            500000,  // 500k USD value
            5000,    // 5k shares
            100,     // $100 per share
            "https://metadata.deedai.com/properties/3",
            true     // Allows fractional ownership
        );
        
        console.log("Created property 3 (Family Home) with ID:", property3);
        
        vm.stopBroadcast();
        
        console.log("Sample properties created successfully!");
    }
}
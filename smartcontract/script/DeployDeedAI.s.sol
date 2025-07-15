// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";

contract DeployDeedAI is Script {
    // Deployment addresses will be stored here
    address public propertyFactory;
    address public propertyDeed;
    address public deedDAO;
    address public revenueDistributor;
    address public loanManager;
    
    // Configuration
    struct DeployConfig {
        address admin;
        address chainlinkRegistry; // For automation
        string networkName;
    }
    
    function run() external {
        // Load deployment configuration
        DeployConfig memory config = getDeployConfig();
        
        console.log("Deploying DeedAI contracts to:", config.networkName);
        console.log("Admin address:", config.admin);
        
        // Start broadcasting transactions
        vm.startBroadcast();
        
        // Deploy the main PropertyFactory contract
        // This will automatically deploy all other contracts
        PropertyFactory factory = new PropertyFactory();
        propertyFactory = address(factory);
        
        console.log("PropertyFactory deployed at:", propertyFactory);
        
        // Get addresses of automatically deployed contracts
        propertyDeed = address(factory.propertyDeed());
        deedDAO = address(factory.deedDAO());
        revenueDistributor = address(factory.revenueDistributor());
        loanManager = address(factory.loanManager());
        
        console.log("PropertyDeed deployed at:", propertyDeed);
        console.log("DeedDAO deployed at:", deedDAO);
        console.log("RevenueDistributor deployed at:", revenueDistributor);
        console.log("LoanManager deployed at:", loanManager);
        
        // Configure contracts
        configureContracts(factory, config);
        
        // Verify deployment
        verifyDeployment(factory);
        
        vm.stopBroadcast();
        
        // Save deployment addresses
        saveDeploymentAddresses(config.networkName);
        
        console.log("Deployment completed successfully!");
    }
    
    function getDeployConfig() internal view returns (DeployConfig memory) {
        string memory network = vm.envString("NETWORK");
        address admin = vm.envAddress("ADMIN_ADDRESS");
        
        DeployConfig memory config;
        config.admin = admin;
        config.networkName = network;
        
        if (keccak256(abi.encodePacked(network)) == keccak256(abi.encodePacked("mainnet"))) {
            config.chainlinkRegistry = 0x02777053d6764996e594c3E88AF1D58D5363a2e6; // Ethereum Mainnet
        } else if (keccak256(abi.encodePacked(network)) == keccak256(abi.encodePacked("polygon"))) {
            config.chainlinkRegistry = 0x02777053d6764996e594c3E88AF1D58D5363a2e6; // Polygon Mainnet
        } else if (keccak256(abi.encodePacked(network)) == keccak256(abi.encodePacked("sepolia"))) {
            config.chainlinkRegistry = 0x02777053d6764996e594c3E88AF1D58D5363a2e6; // Sepolia Testnet
        } else {
            config.chainlinkRegistry = address(0); // Local/other networks
        }
        
        return config;
    }
    
    function configureContracts(PropertyFactory factory, DeployConfig memory config) internal {
        console.log("Configuring contracts...");
        
        // Transfer ownership if admin is different from deployer
        if (config.admin != msg.sender) {
            factory.transferOwnership(config.admin);
            console.log("PropertyFactory ownership transferred to:", config.admin);
        }
        
        // Additional configuration can be added here
        console.log("Configuration completed");
    }
    
    function verifyDeployment(PropertyFactory factory) internal view {
        console.log("Verifying deployment...");
        
        // Verify PropertyFactory
        require(address(factory) != address(0), "PropertyFactory deployment failed");
        require(factory.owner() != address(0), "PropertyFactory owner not set");
        
        // Verify sub-contracts
        require(address(factory.propertyDeed()) != address(0), "PropertyDeed not deployed");
        require(address(factory.deedDAO()) != address(0), "DeedDAO not deployed");
        require(address(factory.revenueDistributor()) != address(0), "RevenueDistributor not deployed");
        require(address(factory.loanManager()) != address(0), "LoanManager not deployed");
        
        console.log("Deployment verification passed");
    }
    
    function saveDeploymentAddresses(string memory network) internal {
        string memory json = "deployments";
        
        vm.serializeAddress(json, "PropertyFactory", propertyFactory);
        vm.serializeAddress(json, "PropertyDeed", propertyDeed);
        vm.serializeAddress(json, "DeedDAO", deedDAO);
        vm.serializeAddress(json, "RevenueDistributor", revenueDistributor);
        vm.serializeAddress(json, "LoanManager", loanManager);
        vm.serializeUint(json, "timestamp", block.timestamp);
        string memory finalJson = vm.serializeString(json, "network", network);
        
        string memory fileName = string.concat("deployments/", network, ".json");
        vm.writeJson(finalJson, fileName);
        
        console.log("Deployment addresses saved to:", fileName);
    }
}

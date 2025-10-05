// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PropertyFactory} from "../src/core/PropertyFactory.sol";

contract DeployChaziEstate is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy PropertyFactory (which deploys all other contracts)
        PropertyFactory propertyFactory = new PropertyFactory();
        
        console.log("PropertyFactory deployed to:", address(propertyFactory));
        console.log("PropertyDeed deployed to:", address(propertyFactory.propertyDeed()));
        console.log("PropertyToken deployed to:", address(propertyFactory.propertyToken()));
        console.log("DeedDAO deployed to:", address(propertyFactory.deedDAO()));
        console.log("RevenueDistributor deployed to:", address(propertyFactory.revenueDistributor()));
        console.log("LoanManager deployed to:", address(propertyFactory.loanManager()));

        vm.stopBroadcast();
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";

contract VerifyContracts is Script {
    function run() external {
        console.log("Contract Verification for Hedera Testnet");
        console.log("Chain ID:", block.chainid);
        
        // Contract addresses from deployment
        address propertyFactory = 0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519;
        address propertyDeed = 0xC7f2Cf4845C6db0e1a1e91ED41Bcd0FcC1b0E141;
        address deedDAO = 0x238213078DbD09f2D15F4c14c02300FA1b2A81BB;
        address revenueDistributor = 0xd85BdcdaE4db1FAEB8eF93331525FE68D7C8B3f0;
        address loanManager = 0xDc82c0362A241Aa94d53546648EACe48C9773dAa;
        
        console.log("Contract Addresses:");
        console.log("PropertyFactory:", propertyFactory);
        console.log("PropertyDeed:", propertyDeed);
        console.log("DeedDAO:", deedDAO);
        console.log("RevenueDistributor:", revenueDistributor);
        console.log("LoanManager:", loanManager);
        
        // Check if contracts exist
        console.log("\nChecking contract existence...");
        console.log("PropertyFactory code size:", propertyFactory.code.length);
        console.log("PropertyDeed code size:", propertyDeed.code.length);
        console.log("DeedDAO code size:", deedDAO.code.length);
        console.log("RevenueDistributor code size:", revenueDistributor.code.length);
        console.log("LoanManager code size:", loanManager.code.length);
        
        console.log("\nVerification instructions:");
        console.log("1. Visit HashScan: https://hashscan.io/testnet");
        console.log("2. Search for each contract address");
        console.log("3. Click 'Verify Contract' if available");
        console.log("4. Upload the source code files");
        console.log("5. Set compiler version to 0.8.28");
        console.log("6. Enable optimization with 200 runs");
        console.log("7. Set via_ir to true");
        
        console.log("\nSource files to upload:");
        console.log("- src/core/PropertyFactory.sol");
        console.log("- src/core/PropertyDeed.sol");
        console.log("- src/core/PropertyToken.sol");
        console.log("- src/governace/DeedDAO.sol");
        console.log("- src/finance/RevenueDistributor.sol");
        console.log("- src/finance/LoanManager.sol");
        console.log("- src/interfaces/IPropertyToken.sol");
        console.log("- src/interfaces/IDeedDAO.sol");
        console.log("- src/interfaces/IRevenueDistributor.sol");
        
        console.log("\nDependencies:");
        console.log("- @openzeppelin/contracts (from lib/openzeppelin-contracts/)");
        console.log("- @chainlink/contracts (from lib/chainlink/)");
    }
}
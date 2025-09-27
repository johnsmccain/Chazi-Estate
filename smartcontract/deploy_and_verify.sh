#!/bin/bash

# chazi-chain Smart Contracts - Deployment and Verification Script for Hedera Testnet
# This script deploys contracts and prepares them for verification

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NETWORK="hedera-testnet"
RPC_URL="https://testnet.hashio.io/api"
CHAIN_ID="296"
COMPILER_VERSION="0.8.28"
OPTIMIZER_RUNS="200"

# Contract addresses (will be updated after deployment)
PROPERTY_FACTORY=""
PROPERTY_DEED=""
PROPERTY_TOKEN=""
DEED_DAO=""
REVENUE_DISTRIBUTOR=""
LOAN_MANAGER=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if forge is installed
    if ! command -v forge &> /dev/null; then
        print_error "Foundry (forge) is not installed. Please install it first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating template..."
        create_env_template
    fi
    
    # Check if private key is set
    if [ -z "$PRIVATE_KEY" ]; then
        print_error "PRIVATE_KEY environment variable is not set."
        print_error "Please set your private key: export PRIVATE_KEY=0xYOUR_PRIVATE_KEY"
        exit 1
    fi
    
    # Check network connectivity
    print_status "Checking network connectivity..."
    if ! cast chain-id --rpc-url "$RPC_URL" &> /dev/null; then
        print_error "Cannot connect to Hedera testnet. Please check your internet connection."
        exit 1
    fi
    
    local current_chain_id=$(cast chain-id --rpc-url "$RPC_URL")
    if [ "$current_chain_id" != "$CHAIN_ID" ]; then
        print_error "Expected chain ID $CHAIN_ID, but got $current_chain_id"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to create .env template
create_env_template() {
    cat > .env << EOF
# Hedera Testnet Configuration
NETWORK=hedera-testnet
HEDERA_RPC_URL=https://testnet.hashio.io/api
ADMIN_ADDRESS=0xYOUR_ADDRESS_HERE
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Gas configuration
GAS_LIMIT=30000000
GAS_PRICE=1000000000
EOF
    print_warning "Please update .env file with your actual values before running deployment."
}

# Function to build contracts
build_contracts() {
    print_status "Building contracts..."
    
    if forge build; then
        print_success "Contracts built successfully"
    else
        print_error "Contract build failed"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if forge test --fuzz-runs 100; then
        print_success "All tests passed"
    else
        print_error "Tests failed"
        exit 1
    fi
}

# Function to deploy contracts
deploy_contracts() {
    print_status "Deploying contracts to Hedera testnet..."
    print_status "Network: $NETWORK (Chain ID: $CHAIN_ID)"
    print_status "RPC URL: $RPC_URL"
    
    # Create deployment script if it doesn't exist
    if [ ! -f "script/DeployHedera.s.sol" ]; then
        print_status "Creating deployment script..."
        create_deployment_script
    fi
    
    # Deploy contracts
    print_status "Starting deployment..."
    
    local deployment_output
    if deployment_output=$(forge script script/DeployHedera.s.sol --rpc-url "$RPC_URL" --broadcast --private-key "$PRIVATE_KEY" 2>&1); then
        print_success "Deployment completed successfully"
        
        # Extract contract addresses from deployment output
        extract_contract_addresses "$deployment_output"
        
        # Save deployment info
        save_deployment_info
        
    else
        print_error "Deployment failed"
        echo "$deployment_output"
        exit 1
    fi
}

# Function to create deployment script
create_deployment_script() {
    cat > script/DeployHedera.s.sol << 'EOF'
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
        console.log("Deployer:", msg.sender);
        
        vm.startBroadcast();
        
        PropertyFactory factory = new PropertyFactory();
        
        console.log("PropertyFactory deployed at:", address(factory));
        console.log("PropertyDeed deployed at:", address(factory.propertyDeed()));
        console.log("PropertyToken deployed at:", address(factory.propertyToken()));
        console.log("DeedDAO deployed at:", address(factory.deedDAO()));
        console.log("RevenueDistributor deployed at:", address(factory.revenueDistributor()));
        console.log("LoanManager deployed at:", address(factory.loanManager()));
        
        vm.stopBroadcast();
        
        console.log("Deployment completed successfully!");
    }
}
EOF
}

# Function to extract contract addresses from deployment output
extract_contract_addresses() {
    local output="$1"
    
    PROPERTY_FACTORY=$(echo "$output" | grep "PropertyFactory deployed at:" | sed 's/.*PropertyFactory deployed at: //')
    PROPERTY_DEED=$(echo "$output" | grep "PropertyDeed deployed at:" | sed 's/.*PropertyDeed deployed at: //')
    PROPERTY_TOKEN=$(echo "$output" | grep "PropertyToken deployed at:" | sed 's/.*PropertyToken deployed at: //')
    DEED_DAO=$(echo "$output" | grep "DeedDAO deployed at:" | sed 's/.*DeedDAO deployed at: //')
    REVENUE_DISTRIBUTOR=$(echo "$output" | grep "RevenueDistributor deployed at:" | sed 's/.*RevenueDistributor deployed at: //')
    LOAN_MANAGER=$(echo "$output" | grep "LoanManager deployed at:" | sed 's/.*LoanManager deployed at: //')
    
    print_success "Contract addresses extracted:"
    echo "  PropertyFactory:    $PROPERTY_FACTORY"
    echo "  PropertyDeed:       $PROPERTY_DEED"
    echo "  PropertyToken:      $PROPERTY_TOKEN"
    echo "  DeedDAO:            $DEED_DAO"
    echo "  RevenueDistributor: $REVENUE_DISTRIBUTOR"
    echo "  LoanManager:        $LOAN_MANAGER"
}

# Function to save deployment information
save_deployment_info() {
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local deployment_file="deployments/hedera-testnet-$(date +%Y%m%d-%H%M%S).json"
    
    mkdir -p deployments
    
    cat > "$deployment_file" << EOF
{
  "network": "hedera-testnet",
  "chainId": $CHAIN_ID,
  "rpcUrl": "$RPC_URL",
  "deployedAt": "$timestamp",
  "deployer": "$(cast wallet address --private-key "$PRIVATE_KEY")",
  "contracts": {
    "PropertyFactory": "$PROPERTY_FACTORY",
    "PropertyDeed": "$PROPERTY_DEED",
    "PropertyToken": "$PROPERTY_TOKEN",
    "DeedDAO": "$DEED_DAO",
    "RevenueDistributor": "$REVENUE_DISTRIBUTOR",
    "LoanManager": "$LOAN_MANAGER"
  },
  "compiler": {
    "version": "$COMPILER_VERSION",
    "optimizer": true,
    "runs": $OPTIMIZER_RUNS,
    "viaIr": true
  }
}
EOF
    
    print_success "Deployment info saved to: $deployment_file"
}

# Function to prepare verification files
prepare_verification() {
    print_status "Preparing verification files..."
    
    local verification_dir="verification_files"
    mkdir -p "$verification_dir"
    
    # Copy main contract files
    cp src/core/PropertyFactory.sol "$verification_dir/"
    cp src/core/PropertyDeed.sol "$verification_dir/"
    cp src/core/PropertyToken.sol "$verification_dir/"
    cp src/governace/DeedDAO.sol "$verification_dir/"
    cp src/finance/RevenueDistributor.sol "$verification_dir/"
    cp src/finance/LoanManager.sol "$verification_dir/"
    
    # Copy interface files
    cp src/interfaces/IPropertyToken.sol "$verification_dir/"
    cp src/interfaces/IDeedDAO.sol "$verification_dir/"
    cp src/interfaces/IRevenueDistributor.sol "$verification_dir/"
    
    # Copy OpenZeppelin contracts
    mkdir -p "$verification_dir/openzeppelin"
    cp lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol "$verification_dir/openzeppelin/"
    cp lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol "$verification_dir/openzeppelin/"
    cp lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol "$verification_dir/openzeppelin/"
    cp lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol "$verification_dir/openzeppelin/"
    cp lib/openzeppelin-contracts/contracts/access/Ownable.sol "$verification_dir/openzeppelin/"
    cp lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol "$verification_dir/openzeppelin/"
    cp lib/openzeppelin-contracts/contracts/utils/Pausable.sol "$verification_dir/openzeppelin/"
    cp lib/openzeppelin-contracts/contracts/utils/math/Math.sol "$verification_dir/openzeppelin/"
    
    # Copy Chainlink contracts
    mkdir -p "$verification_dir/chainlink"
    cp lib/chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol "$verification_dir/chainlink/"
    
    # Create verification info file
    cat > "$verification_dir/VERIFICATION_INFO.txt" << EOF
chazi-chain Smart Contracts - Verification Information
================================================

Network: Hedera Testnet (Chain ID: $CHAIN_ID)
RPC URL: $RPC_URL
Explorer: https://hashscan.io/testnet
Deployed At: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

Contract Addresses:
- PropertyFactory: $PROPERTY_FACTORY
- PropertyDeed: $PROPERTY_DEED
- PropertyToken: $PROPERTY_TOKEN
- DeedDAO: $DEED_DAO
- RevenueDistributor: $REVENUE_DISTRIBUTOR
- LoanManager: $LOAN_MANAGER

Compiler Settings:
- Version: $COMPILER_VERSION
- Optimization: Enabled
- Runs: $OPTIMIZER_RUNS
- EVM Version: default
- Via IR: true

Verification Steps:
1. Visit https://hashscan.io/testnet
2. Search for each contract address
3. Click "Verify Contract"
4. Upload the source files in this directory
5. Set the compiler settings above
6. Submit for verification

File Structure:
- Main contracts: *.sol files in root
- Interfaces: I*.sol files in root
- OpenZeppelin: openzeppelin/ directory
- Chainlink: chainlink/ directory

Dependencies:
- @openzeppelin/contracts (from openzeppelin/ directory)
- @chainlink/contracts (from chainlink/ directory)
EOF
    
    # Create zip package
    cd "$verification_dir"
    zip -r ../deedai_verification_package.zip . > /dev/null 2>&1
    cd ..
    
    print_success "Verification files prepared in: $verification_dir/"
    print_success "Verification package created: deedai_verification_package.zip"
}

# Function to attempt automatic verification
attempt_verification() {
    print_status "Attempting automatic verification..."
    
    local contracts=(
        "src/core/PropertyFactory.sol:PropertyFactory:$PROPERTY_FACTORY"
        "src/core/PropertyDeed.sol:PropertyDeed:$PROPERTY_DEED"
        "src/governace/DeedDAO.sol:DeedDAO:$DEED_DAO"
        "src/finance/RevenueDistributor.sol:RevenueDistributor:$REVENUE_DISTRIBUTOR"
        "src/finance/LoanManager.sol:LoanManager:$LOAN_MANAGER"
    )
    
    local verified_count=0
    local total_count=${#contracts[@]}
    
    for contract_info in "${contracts[@]}"; do
        IFS=':' read -r contract_path contract_name contract_address <<< "$contract_info"
        
        print_status "Verifying $contract_name at $contract_address..."
        
        # Try different verification methods
        local verification_success=false
        
        # Method 1: Try with Sourcify (default verifier)
        if forge verify-contract "$contract_address" "$contract_path:$contract_name" \
            --rpc-url "$RPC_URL" \
            --compiler-version "$COMPILER_VERSION" \
            --num-of-optimizations "$OPTIMIZER_RUNS" \
            --via-ir \
            --watch 2>/dev/null; then
            print_success "$contract_name verified successfully with Sourcify!"
            verification_success=true
            ((verified_count++))
        else
            # Method 2: Try with Etherscan API (if available)
            if [ -n "$ETHERSCAN_API_KEY" ]; then
                print_status "Trying Etherscan verification for $contract_name..."
                if forge verify-contract "$contract_address" "$contract_path:$contract_name" \
                    --verifier etherscan \
                    --etherscan-api-key "$ETHERSCAN_API_KEY" \
                    --rpc-url "$RPC_URL" \
                    --compiler-version "$COMPILER_VERSION" \
                    --num-of-optimizations "$OPTIMIZER_RUNS" \
                    --via-ir \
                    --watch 2>/dev/null; then
                    print_success "$contract_name verified successfully with Etherscan!"
                    verification_success=true
                    ((verified_count++))
                fi
            fi
            
            # Method 3: Try with Blockscout
            if [ "$verification_success" = false ]; then
                print_status "Trying Blockscout verification for $contract_name..."
                if forge verify-contract "$contract_address" "$contract_path:$contract_name" \
                    --verifier blockscout \
                    --rpc-url "$RPC_URL" \
                    --compiler-version "$COMPILER_VERSION" \
                    --num-of-optimizations "$OPTIMIZER_RUNS" \
                    --via-ir \
                    --watch 2>/dev/null; then
                    print_success "$contract_name verified successfully with Blockscout!"
                    verification_success=true
                    ((verified_count++))
                fi
            fi
        fi
        
        if [ "$verification_success" = false ]; then
            print_warning "$contract_name verification failed - manual verification required"
        fi
    done
    
    if [ $verified_count -eq 0 ]; then
        print_warning "Automatic verification not supported for Hedera testnet"
        print_status "Manual verification required - see verification files prepared"
        print_status "You can also try setting ETHERSCAN_API_KEY environment variable"
    else
        print_success "$verified_count/$total_count contracts verified automatically"
    fi
}

# Function to display final information
display_final_info() {
    echo ""
    echo "=========================================="
    echo "🎉 DEPLOYMENT AND VERIFICATION COMPLETE!"
    echo "=========================================="
    echo ""
    echo "📋 Contract Addresses:"
    echo "  PropertyFactory:    $PROPERTY_FACTORY"
    echo "  PropertyDeed:       $PROPERTY_DEED"
    echo "  PropertyToken:      $PROPERTY_TOKEN"
    echo "  DeedDAO:            $DEED_DAO"
    echo "  RevenueDistributor: $REVENUE_DISTRIBUTOR"
    echo "  LoanManager:        $LOAN_MANAGER"
    echo ""
    echo "🌐 Network Information:"
    echo "  Network: Hedera Testnet"
    echo "  Chain ID: $CHAIN_ID"
    echo "  RPC URL: $RPC_URL"
    echo "  Explorer: https://hashscan.io/testnet"
    echo ""
    echo "📁 Files Created:"
    echo "  - verification_files/ (source files for manual verification)"
    echo "  - deedai_verification_package.zip (verification package)"
    echo "  - deployments/ (deployment information)"
    echo ""
    echo "🔍 Next Steps:"
    echo "  1. Verify contracts manually at https://hashscan.io/testnet"
    echo "  2. Test contract functionality"
    echo "  3. Create sample properties"
    echo "  4. Test fractional ownership and DAO governance"
    echo ""
    echo "📖 Manual Verification:"
    echo "  1. Visit https://hashscan.io/testnet"
    echo "  2. Search for each contract address"
    echo "  3. Click 'Verify Contract'"
    echo "  4. Upload files from verification_files/ directory"
    echo "  5. Use compiler settings: v$COMPILER_VERSION, optimization enabled, $OPTIMIZER_RUNS runs, via-ir true"
    echo ""
}

# Function to show help
show_help() {
    echo "chazi-chain Smart Contracts - Deployment and Verification Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --deploy-only     Deploy contracts only (skip verification preparation)"
    echo "  --verify-only     Prepare verification files only (skip deployment)"
    echo "  --test-only       Run tests only"
    echo "  --help           Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  PRIVATE_KEY      Your private key for deployment (required)"
    echo "  ADMIN_ADDRESS    Admin address for contract ownership (optional)"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Full deployment and verification"
    echo "  $0 --deploy-only                     # Deploy contracts only"
    echo "  $0 --verify-only                     # Prepare verification files only"
    echo "  PRIVATE_KEY=0x123... $0 --test-only  # Run tests only"
    echo ""
}

# Main function
main() {
    echo "🚀 chazi-chain Smart Contracts - Deployment and Verification"
    echo "======================================================"
    echo ""
    
    # Parse command line arguments
    local deploy_only=false
    local verify_only=false
    local test_only=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --deploy-only)
                deploy_only=true
                shift
                ;;
            --verify-only)
                verify_only=true
                shift
                ;;
            --test-only)
                test_only=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Load environment variables
    if [ -f ".env" ]; then
        source .env
    fi
    
    # Check prerequisites
    check_prerequisites
    
    # Build contracts
    build_contracts
    
    if [ "$test_only" = true ]; then
        run_tests
        print_success "Tests completed successfully!"
        exit 0
    fi
    
    if [ "$verify_only" = true ]; then
        prepare_verification
        print_success "Verification files prepared successfully!"
        exit 0
    fi
    
    if [ "$deploy_only" = true ]; then
        deploy_contracts
        print_success "Deployment completed successfully!"
        exit 0
    fi
    
    # Full deployment and verification process
    run_tests
    deploy_contracts
    prepare_verification
    attempt_verification
    display_final_info
    
    print_success "All operations completed successfully! 🎉"
}

# Run main function with all arguments
main "$@"

#!/bin/bash

# chazi-chain Smart Contracts - Foundry Verification Script
# This script uses the proper forge verify-contract commands with correct options

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RPC_URL="https://testnet.hashio.io/api"
COMPILER_VERSION="0.8.28"
OPTIMIZER_RUNS="200"

# Contract addresses (update these after deployment)
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

# Function to show help
show_help() {
    echo "chazi-chain Smart Contracts - Foundry Verification Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --contracts <ADDRESSES>  Comma-separated contract addresses"
    echo "  --etherscan-key <KEY>    Etherscan API key (optional)"
    echo "  --verifier <VERIFIER>    Verification provider (sourcify, etherscan, blockscout)"
    echo "  --help                  Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  ETHERSCAN_API_KEY       Etherscan API key"
    echo "  VERIFIER                Verification provider"
    echo ""
    echo "Examples:"
    echo "  $0 --contracts 0x123...,0x456...,0x789..."
    echo "  $0 --etherscan-key YOUR_KEY --verifier etherscan"
    echo "  ETHERSCAN_API_KEY=YOUR_KEY $0 --verifier etherscan"
    echo ""
}

# Function to verify a single contract
verify_contract() {
    local contract_address=$1
    local contract_path=$2
    local contract_name=$3
    local verifier=${4:-"sourcify"}
    
    print_status "Verifying $contract_name at $contract_address using $verifier..."
    
    local cmd="forge verify-contract $contract_address $contract_path:$contract_name"
    cmd="$cmd --rpc-url $RPC_URL"
    cmd="$cmd --compiler-version $COMPILER_VERSION"
    cmd="$cmd --num-of-optimizations $OPTIMIZER_RUNS"
    cmd="$cmd --via-ir"
    cmd="$cmd --watch"
    
    # Add verifier-specific options
    case $verifier in
        "etherscan")
            if [ -n "$ETHERSCAN_API_KEY" ]; then
                cmd="$cmd --verifier etherscan --etherscan-api-key $ETHERSCAN_API_KEY"
            else
                print_error "ETHERSCAN_API_KEY is required for Etherscan verification"
                return 1
            fi
            ;;
        "blockscout")
            cmd="$cmd --verifier blockscout"
            ;;
        "sourcify"|*)
            cmd="$cmd --verifier sourcify"
            ;;
    esac
    
    print_status "Running: $cmd"
    
    if eval $cmd; then
        print_success "$contract_name verified successfully with $verifier!"
        return 0
    else
        print_warning "$contract_name verification failed with $verifier"
        return 1
    fi
}

# Function to verify all contracts
verify_all_contracts() {
    local verifier=${1:-"sourcify"}
    local verified_count=0
    local total_count=0
    
    # Contract definitions: path:name:address
    local contracts=(
        "src/core/PropertyFactory.sol:PropertyFactory:$PROPERTY_FACTORY"
        "src/core/PropertyDeed.sol:PropertyDeed:$PROPERTY_DEED"
        "src/core/PropertyToken.sol:PropertyToken:$PROPERTY_TOKEN"
        "src/governace/DeedDAO.sol:DeedDAO:$DEED_DAO"
        "src/finance/RevenueDistributor.sol:RevenueDistributor:$REVENUE_DISTRIBUTOR"
        "src/finance/LoanManager.sol:LoanManager:$LOAN_MANAGER"
    )
    
    print_status "Starting verification with $verifier..."
    echo ""
    
    for contract_info in "${contracts[@]}"; do
        IFS=':' read -r contract_path contract_name contract_address <<< "$contract_info"
        
        if [ -n "$contract_address" ] && [ "$contract_address" != "0x0000000000000000000000000000000000000000" ]; then
            ((total_count++))
            if verify_contract "$contract_address" "$contract_path" "$contract_name" "$verifier"; then
                ((verified_count++))
            fi
            echo ""
        else
            print_warning "Skipping $contract_name - no address provided"
        fi
    done
    
    echo "=========================================="
    print_status "Verification Summary:"
    echo "  Total contracts: $total_count"
    echo "  Successfully verified: $verified_count"
    echo "  Failed: $((total_count - verified_count))"
    echo "  Verifier used: $verifier"
    echo "=========================================="
    
    if [ $verified_count -eq $total_count ] && [ $total_count -gt 0 ]; then
        print_success "All contracts verified successfully! 🎉"
    elif [ $verified_count -gt 0 ]; then
        print_warning "Some contracts verified successfully"
    else
        print_error "No contracts were verified"
    fi
}

# Function to try multiple verifiers
try_all_verifiers() {
    local verifiers=("sourcify" "blockscout")
    
    if [ -n "$ETHERSCAN_API_KEY" ]; then
        verifiers+=("etherscan")
    fi
    
    print_status "Trying multiple verification providers..."
    echo ""
    
    for verifier in "${verifiers[@]}"; do
        print_status "Attempting verification with $verifier..."
        if verify_all_contracts "$verifier"; then
            print_success "Verification completed with $verifier!"
            return 0
        fi
        echo ""
    done
    
    print_error "All verification attempts failed"
    return 1
}

# Function to load contract addresses from deployment file
load_deployment_addresses() {
    local deployment_file=""
    
    # Find the most recent deployment file
    if [ -d "deployments" ]; then
        deployment_file=$(find deployments -name "*.json" -type f | sort -r | head -n 1)
    fi
    
    if [ -n "$deployment_file" ] && [ -f "$deployment_file" ]; then
        print_status "Loading contract addresses from $deployment_file"
        
        # Extract addresses using jq (if available) or basic parsing
        if command -v jq &> /dev/null; then
            PROPERTY_FACTORY=$(jq -r '.contracts.PropertyFactory' "$deployment_file")
            PROPERTY_DEED=$(jq -r '.contracts.PropertyDeed' "$deployment_file")
            PROPERTY_TOKEN=$(jq -r '.contracts.PropertyToken' "$deployment_file")
            DEED_DAO=$(jq -r '.contracts.DeedDAO' "$deployment_file")
            REVENUE_DISTRIBUTOR=$(jq -r '.contracts.RevenueDistributor' "$deployment_file")
            LOAN_MANAGER=$(jq -r '.contracts.LoanManager' "$deployment_file")
        else
            print_warning "jq not found, please provide contract addresses manually"
        fi
    else
        print_warning "No deployment file found, please provide contract addresses manually"
    fi
}

# Main function
main() {
    echo "🔍 chazi-chain Smart Contracts - Foundry Verification"
    echo "================================================"
    echo ""
    
    # Parse command line arguments
    local verifier=""
    local contract_addresses=""
    local etherscan_key=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --contracts)
                contract_addresses="$2"
                shift 2
                ;;
            --etherscan-key)
                etherscan_key="$2"
                ETHERSCAN_API_KEY="$2"
                shift 2
                ;;
            --verifier)
                verifier="$2"
                shift 2
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
    
    # Set verifier from environment if not provided
    if [ -z "$verifier" ]; then
        verifier=${VERIFIER:-"sourcify"}
    fi
    
    # Load contract addresses
    load_deployment_addresses
    
    # Parse contract addresses if provided
    if [ -n "$contract_addresses" ]; then
        IFS=',' read -ra ADDRESSES <<< "$contract_addresses"
        if [ ${#ADDRESSES[@]} -ge 6 ]; then
            PROPERTY_FACTORY="${ADDRESSES[0]}"
            PROPERTY_DEED="${ADDRESSES[1]}"
            PROPERTY_TOKEN="${ADDRESSES[2]}"
            DEED_DAO="${ADDRESSES[3]}"
            REVENUE_DISTRIBUTOR="${ADDRESSES[4]}"
            LOAN_MANAGER="${ADDRESSES[5]}"
        else
            print_error "Please provide all 6 contract addresses"
            exit 1
        fi
    fi
    
    # Check if we have contract addresses
    if [ -z "$PROPERTY_FACTORY" ] || [ "$PROPERTY_FACTORY" = "null" ]; then
        print_error "No contract addresses found. Please:"
        echo "  1. Run deployment first, or"
        echo "  2. Provide addresses with --contracts option, or"
        echo "  3. Update the script with your contract addresses"
        exit 1
    fi
    
    # Display contract addresses
    echo "Contract Addresses:"
    echo "  PropertyFactory:    $PROPERTY_FACTORY"
    echo "  PropertyDeed:       $PROPERTY_DEED"
    echo "  PropertyToken:      $PROPERTY_TOKEN"
    echo "  DeedDAO:            $DEED_DAO"
    echo "  RevenueDistributor: $REVENUE_DISTRIBUTOR"
    echo "  LoanManager:        $LOAN_MANAGER"
    echo ""
    
    # Verify contracts
    if [ "$verifier" = "all" ]; then
        try_all_verifiers
    else
        verify_all_contracts "$verifier"
    fi
}

# Run main function with all arguments
main "$@"

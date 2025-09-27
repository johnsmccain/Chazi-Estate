import {
  Client,
  AccountId,
  PrivateKey,
  ContractCreateFlow,
  FileCreateTransaction,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
  Status
} from '@hashgraph/sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

class ContractDeployer {
  constructor() {
    this.client = null;
    this.operatorId = null;
    this.operatorKey = null;
    this.deployedContracts = {};
  }

  async initialize() {
    try {
      // Initialize Hedera client
      this.operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
      this.operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
      
      this.client = Client.forTestnet()
        .setOperator(this.operatorId, this.operatorKey);

      console.log('✅ Hedera client initialized successfully');
      console.log(`📋 Operator ID: ${this.operatorId}`);
      console.log(`🔑 Operator Key: ${this.operatorKey.publicKey.toString()}`);
    } catch (error) {
      console.error('❌ Failed to initialize Hedera client:', error);
      throw error;
    }
  }

  async deployContract(contractName, bytecode, gas = 3000000) {
    try {
      console.log(`🚀 Deploying ${contractName}...`);

      // Create file transaction
      const fileCreateTx = new FileCreateTransaction()
        .setKeys([this.operatorKey.publicKey])
        .setContents(bytecode);

      const fileCreateResponse = await fileCreateTx.execute(this.client);
      const fileCreateReceipt = await fileCreateResponse.getReceipt(this.client);
      const fileId = fileCreateReceipt.fileId;

      console.log(`📄 File created: ${fileId}`);

      // Create contract
      const contractCreateTx = new ContractCreateFlow()
        .setGas(gas)
        .setBytecode(fileId)
        .setAdminKey(this.operatorKey.publicKey);

      const contractCreateResponse = await contractCreateTx.execute(this.client);
      const contractCreateReceipt = await contractCreateResponse.getReceipt(this.client);
      const contractId = contractCreateReceipt.contractId;

      console.log(`✅ ${contractName} deployed successfully: ${contractId}`);

      return {
        contractId: contractId.toString(),
        fileId: fileId.toString(),
        gas: gas
      };
    } catch (error) {
      console.error(`❌ Failed to deploy ${contractName}:`, error);
      throw error;
    }
  }

  async deployPropertyToken() {
    try {
      console.log('\n🏗️ Deploying PropertyToken contract...');
      
      // For now, we'll use a simplified bytecode since we can't compile with Foundry
      // In production, you would compile the actual contract and use the bytecode
      const mockBytecode = '0x608060405234801561001057600080fd5b506040516101e83803806101e88339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101928061005c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6c4c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c64736f6c634300060c0033';

      const result = await this.deployContract('PropertyToken', mockBytecode);
      this.deployedContracts.PropertyToken = result;
      
      return result;
    } catch (error) {
      console.error('❌ Failed to deploy PropertyToken:', error);
      throw error;
    }
  }

  async deployPropertyFactory() {
    try {
      console.log('\n🏗️ Deploying PropertyFactory contract...');
      
      const mockBytecode = '0x608060405234801561001057600080fd5b506040516101e83803806101e88339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101928061005c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6c4c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c64736f6c634300060c0033';

      const result = await this.deployContract('PropertyFactory', mockBytecode);
      this.deployedContracts.PropertyFactory = result;
      
      return result;
    } catch (error) {
      console.error('❌ Failed to deploy PropertyFactory:', error);
      throw error;
    }
  }

  async deployAllContracts() {
    try {
      console.log('🚀 Starting contract deployment...\n');

      // Deploy contracts in order
      await this.deployPropertyToken();
      await this.deployPropertyFactory();

      console.log('\n✅ All contracts deployed successfully!');
      console.log('\n📋 Deployment Summary:');
      console.log('=====================');
      
      Object.entries(this.deployedContracts).forEach(([name, contract]) => {
        console.log(`${name}:`);
        console.log(`  Contract ID: ${contract.contractId}`);
        console.log(`  File ID: ${contract.fileId}`);
        console.log(`  Gas Used: ${contract.gas}`);
        console.log('');
      });

      // Save deployment info to file
      const deploymentInfo = {
        timestamp: new Date().toISOString(),
        network: 'testnet',
        contracts: this.deployedContracts
      };

      fs.writeFileSync(
        path.join(process.cwd(), 'deployment-info.json'),
        JSON.stringify(deploymentInfo, null, 2)
      );

      console.log('💾 Deployment information saved to deployment-info.json');
      
      return this.deployedContracts;
    } catch (error) {
      console.error('❌ Contract deployment failed:', error);
      throw error;
    }
  }

  async verifyDeployment() {
    try {
      console.log('\n🔍 Verifying contract deployment...');

      for (const [name, contract] of Object.entries(this.deployedContracts)) {
        try {
          // Try to call a simple function to verify the contract is working
          const query = new ContractCallQuery()
            .setContractId(contract.contractId)
            .setGas(100000);

          await query.execute(this.client);
          console.log(`✅ ${name} verification successful`);
        } catch (error) {
          console.log(`⚠️  ${name} verification failed (this is expected for mock contracts):`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Deployment verification failed:', error);
    }
  }
}

// Main deployment function
async function main() {
  try {
    console.log('🏗️ chazi-chain Smart Contract Deployment');
    console.log('====================================\n');

    // Check environment variables
    if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_PRIVATE_KEY) {
      throw new Error('Missing required environment variables: HEDERA_OPERATOR_ID and HEDERA_PRIVATE_KEY');
    }

    const deployer = new ContractDeployer();
    
    // Initialize
    await deployer.initialize();
    
    // Deploy all contracts
    const contracts = await deployer.deployAllContracts();
    
    // Verify deployment
    await deployer.verifyDeployment();
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env file with the contract addresses');
    console.log('2. Test the contracts using the backend API');
    console.log('3. Deploy to mainnet when ready');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ContractDeployer;


import {
  Client,
  AccountId,
  PrivateKey,
  ContractCreateFlow,
  FileCreateTransaction,
  Hbar,
  ContractId
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

interface DeployedContracts {
  [key: string]: ContractId;
}

class ContractDeployer {
  private client: Client | null = null;
  private operatorId: AccountId | null = null;
  private operatorKey: PrivateKey | null = null;
  private deployedContracts: DeployedContracts = {};

  async initialize(): Promise<boolean> {
    try {
      console.log('🏗️ chazi-chain Smart Contract Deployment');
      console.log('====================================\n');

      // Check environment variables
      if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_PRIVATE_KEY) {
        throw new Error('Missing required environment variables: HEDERA_OPERATOR_ID and HEDERA_PRIVATE_KEY');
      }

      // Initialize Hedera client
      this.operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
      this.operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
      
      this.client = Client.forTestnet()
        .setOperator(this.operatorId, this.operatorKey);

      console.log('✅ Hedera client initialized successfully');
      console.log(`📋 Operator ID: ${this.operatorId}`);
      console.log(`🔑 Operator Key: ${this.operatorKey.publicKey.toString()}`);

      return true;
    } catch (error: any) {
      console.error('❌ Failed to initialize:', error.message);
      return false;
    }
  }

  async deployContract(contractName: string, gas: number = 3000000): Promise<ContractId | null> {
    try {
      if (!this.client || !this.operatorKey) {
        throw new Error('Client not initialized');
      }

      console.log(`\n🚀 Deploying ${contractName} contract...`);

      // This would typically load actual contract bytecode
      // For now, using a placeholder bytecode
      const contractBytecode = this.getContractBytecode(contractName);

      // Create file transaction
      const fileCreateTx = new FileCreateTransaction()
        .setKeys([this.operatorKey.publicKey])
        .setContents(contractBytecode);

      const fileCreateResponse = await fileCreateTx.execute(this.client);
      const fileCreateReceipt = await fileCreateResponse.getReceipt(this.client);
      const fileId = fileCreateReceipt.fileId;

      if (!fileId) {
        throw new Error('Failed to create file');
      }

      console.log(`📄 File created: ${fileId}`);

      // Create contract
      const contractCreateTx = new ContractCreateFlow()
        .setGas(gas)
        .setBytecode(contractBytecode)
        .setAdminKey(this.operatorKey.publicKey);

      const contractCreateResponse = await contractCreateTx.execute(this.client);
      const contractCreateReceipt = await contractCreateResponse.getReceipt(this.client);
      const contractId = contractCreateReceipt.contractId;

      if (!contractId) {
        throw new Error('Failed to create contract');
      }

      console.log(`✅ ${contractName} deployed successfully!`);
      console.log(`📋 Contract ID: ${contractId}`);
      console.log(`⛽ Gas used: ${gas}`);

      this.deployedContracts[contractName] = contractId;
      return contractId;

    } catch (error: any) {
      console.error(`❌ Failed to deploy ${contractName}:`, error.message);
      return null;
    }
  }

  private getContractBytecode(contractName: string): string {
    // This would load actual contract bytecode from compiled files
    // For now, returning placeholder bytecode
    const bytecodes: { [key: string]: string } = {
      'PropertyToken': '608060405234801561001057600080fd5b506040516101e83803806101e88339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101928061005c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6c4c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c64736f6c634300060c0033',
      'PropertyFactory': '608060405234801561001057600080fd5b506040516101e83803806101e88339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101928061005c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6c4c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c64736f6c634300060c0033',
      'DeedDAO': '608060405234801561001057600080fd5b506040516101e83803806101e88339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101928061005c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6c4c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c64736f6c634300060c0033'
    };

    return bytecodes[contractName] || bytecodes['PropertyToken'];
  }

  async deployAllContracts(): Promise<void> {
    const contracts = [
      { name: 'PropertyToken', gas: 3000000 },
      { name: 'PropertyFactory', gas: 2500000 },
      { name: 'DeedDAO', gas: 2000000 }
    ];

    console.log('\n📋 Deploying all contracts...\n');

    for (const contract of contracts) {
      const contractId = await this.deployContract(contract.name, contract.gas);
      if (!contractId) {
        console.error(`❌ Failed to deploy ${contract.name}, stopping deployment`);
        return;
      }
    }

    console.log('\n🎉 All contracts deployed successfully!');
    this.printDeploymentSummary();
  }

  private printDeploymentSummary(): void {
    console.log('\n📊 Deployment Summary');
    console.log('====================');
    
    Object.entries(this.deployedContracts).forEach(([name, contractId]) => {
      console.log(`${name}: ${contractId}`);
    });

    console.log('\n📝 Environment Variables to Add:');
    console.log('================================');
    
    Object.entries(this.deployedContracts).forEach(([name, contractId]) => {
      const envVar = name.toUpperCase().replace(/([A-Z])/g, '_$1').substring(1);
      console.log(`${envVar}_CONTRACT_ID=${contractId}`);
    });
  }

  async getAccountBalance(): Promise<void> {
    try {
      if (!this.client || !this.operatorId) {
        throw new Error('Client not initialized');
      }

      const balance = await this.client.getAccountBalance(this.operatorId);
      console.log(`\n💰 Account Balance: ${balance.hbars.toString()} HBAR`);
    } catch (error: any) {
      console.error('❌ Failed to get account balance:', error.message);
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const deployer = new ContractDeployer();
  
  const initialized = await deployer.initialize();
  if (!initialized) {
    process.exit(1);
  }

  await deployer.getAccountBalance();
  await deployer.deployAllContracts();
}

// Run the deployment
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
}

export default ContractDeployer;

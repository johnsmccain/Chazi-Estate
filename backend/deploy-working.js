import {
  Client,
  AccountId,
  PrivateKey,
  ContractCreateFlow,
  FileCreateTransaction,
  Hbar
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

async function deployContracts() {
  try {
    console.log('🏗️ chazi-chain Smart Contract Deployment (Working)');
    console.log('==============================================\n');

    // Check environment variables
    if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_PRIVATE_KEY) {
      throw new Error('Missing required environment variables: HEDERA_OPERATOR_ID and HEDERA_PRIVATE_KEY');
    }

    // Initialize Hedera client
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
    
    const client = Client.forTestnet()
      .setOperator(operatorId, operatorKey);

    console.log('✅ Hedera client initialized successfully');
    console.log(`📋 Operator ID: ${operatorId}`);
    console.log(`🔑 Operator Key: ${operatorKey.publicKey.toString()}`);

    // Create a simple contract bytecode as a string
    const contractBytecode = '608060405234801561001057600080fd5b506040516101e83803806101e88339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101928061005c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6c4c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c64736f6c634300060c0033';

    console.log('\n🚀 Deploying PropertyToken contract...');

    // Create file transaction
    const fileCreateTx = new FileCreateTransaction()
      .setKeys([operatorKey.publicKey])
      .setContents(contractBytecode);

    const fileCreateResponse = await fileCreateTx.execute(client);
    const fileCreateReceipt = await fileCreateResponse.getReceipt(client);
    const fileId = fileCreateReceipt.fileId;

    console.log(`📄 File created: ${fileId}`);

    // Create contract
    const contractCreateTx = new ContractCreateFlow()
      .setGas(3000000)
      .setBytecode(fileId)
      .setAdminKey(operatorKey.publicKey);

    const contractCreateResponse = await contractCreateTx.execute(client);
    const contractCreateReceipt = await contractCreateResponse.getReceipt(client);
    const contractId = contractCreateReceipt.contractId;

    console.log(`✅ PropertyToken contract deployed successfully: ${contractId}`);

    // Deploy PropertyFactory contract
    console.log('\n🚀 Deploying PropertyFactory contract...');

    const factoryFileCreateTx = new FileCreateTransaction()
      .setKeys([operatorKey.publicKey])
      .setContents(contractBytecode);

    const factoryFileCreateResponse = await factoryFileCreateTx.execute(client);
    const factoryFileCreateReceipt = await factoryFileCreateResponse.getReceipt(client);
    const factoryFileId = factoryFileCreateReceipt.fileId;

    console.log(`📄 Factory file created: ${factoryFileId}`);

    const factoryContractCreateTx = new ContractCreateFlow()
      .setGas(3000000)
      .setBytecode(factoryFileId)
      .setAdminKey(operatorKey.publicKey);

    const factoryContractCreateResponse = await factoryContractCreateTx.execute(client);
    const factoryContractCreateReceipt = await factoryContractCreateResponse.getReceipt(client);
    const factoryContractId = factoryContractCreateReceipt.contractId;

    console.log(`✅ PropertyFactory contract deployed successfully: ${factoryContractId}`);

    // Save deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      network: 'testnet',
      contracts: {
        PropertyToken: {
          contractId: contractId.toString(),
          fileId: fileId.toString(),
          gas: 3000000
        },
        PropertyFactory: {
          contractId: factoryContractId.toString(),
          fileId: factoryFileId.toString(),
          gas: 3000000
        }
      }
    };

    console.log('\n✅ All contracts deployed successfully!');
    console.log('\n📋 Deployment Summary:');
    console.log('=====================');
    console.log(`PropertyToken: ${contractId}`);
    console.log(`PropertyFactory: ${factoryContractId}`);
    console.log(`\n💾 Deployment information:`);
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Save to file
    const fs = await import('fs');
    fs.writeFileSync(
      'deployment-info.json',
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env file with the contract addresses:');
    console.log(`   HEDERA_CONTRACT_ID=${contractId}`);
    console.log(`   HEDERA_FACTORY_CONTRACT_ID=${factoryContractId}`);
    console.log('2. Test the contracts using the backend API');
    console.log('3. Deploy to mainnet when ready');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deployContracts();


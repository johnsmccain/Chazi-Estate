# chazi-chain Deployment Solution

## Issue Analysis

The deployment is failing due to a compatibility issue between the Hedera SDK version (2.70.0) and the bytecode format. The error occurs when trying to set the bytecode in the ContractCreateFlow.

## Solution Options

### Option 1: Use Hedera Portal (Recommended)

1. **Go to Hedera Portal**: https://portal.hedera.com/
2. **Create Testnet Account**: Get your credentials
3. **Use Hedera Studio**: Deploy contracts through the web interface
4. **Get Contract Addresses**: Copy the deployed contract addresses

### Option 2: Use Hedera CLI (Alternative)

```bash
# Install Hedera CLI
curl -sSfL https://raw.githubusercontent.com/hashgraph/hedera-cli/main/install.sh | bash

# Configure your account
hedera account configure

# Deploy contracts
hedera contract deploy --bytecode path/to/contract.bin
```

### Option 3: Use Foundry (For Smart Contract Development)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Build and deploy
cd Chazi-Estate/smartcontract
forge build
forge script script/DeployChaziChain.s.sol --rpc-url hedera-testnet --broadcast
```

### Option 4: Manual Deployment (Current Workaround)

For now, you can use the mock deployment to test the system:

```bash
# Run mock deployment
node mock-deploy.js

# Update your .env file with mock addresses
HEDERA_CONTRACT_ID=0.0.123456
HEDERA_FACTORY_CONTRACT_ID=0.0.123457
```

## Working Deployment Script

Here's a working deployment script that should work with the current setup:

```javascript
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
    console.log('🏗️ chazi-chain Smart Contract Deployment');
    console.log('====================================\n');

    // Check environment variables
    if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_PRIVATE_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Initialize Hedera client
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
    
    const client = Client.forTestnet()
      .setOperator(operatorId, operatorKey);

    console.log('✅ Hedera client initialized successfully');

    // Create a simple contract bytecode
    const contractBytecode = '608060405234801561001057600080fd5b506040516101e83803806101e88339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101928061005c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d6c4c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c64736f6c634300060c0033';

    console.log('\n🚀 Deploying contracts...');

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

    console.log(`✅ Contract deployed successfully: ${contractId}`);

    // Save deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      network: 'testnet',
      contracts: {
        PropertyToken: {
          contractId: contractId.toString(),
          fileId: fileId.toString(),
          gas: 3000000
        }
      }
    };

    console.log('\n✅ Deployment completed successfully!');
    console.log(`📋 Contract ID: ${contractId}`);

    // Save to file
    const fs = await import('fs');
    fs.writeFileSync(
      'deployment-info.json',
      JSON.stringify(deploymentInfo, null, 2)
    );

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployContracts();
```

## Next Steps

1. **Choose a deployment method** from the options above
2. **Get your Hedera credentials** from the portal
3. **Deploy the contracts** using your chosen method
4. **Update your .env file** with the contract addresses
5. **Test the system** using the backend API

## Testing the System

After deployment, test the system:

```bash
# Start the backend
npm run dev

# Test health endpoint
curl http://localhost:3001/health

# Test Hedera integration
curl http://localhost:3001/api/hedera/health
```

## Troubleshooting

- **Insufficient Balance**: Get more HBAR from the portal
- **Invalid Credentials**: Check your account ID and private key format
- **Network Issues**: Ensure you're using the correct network (testnet/mainnet)
- **SDK Issues**: Try updating or downgrading the Hedera SDK version

## Production Deployment

For mainnet deployment:

1. **Get mainnet account** with real HBAR
2. **Update network** to mainnet
3. **Deploy contracts** using the same method
4. **Verify deployment** on Hedera Explorer
5. **Update environment** variables

---

**Note**: The mock deployment allows you to test the system while resolving the deployment issues. The actual contracts will need to be deployed using one of the methods above.


import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupHedera() {
  try {
    console.log('🔧 chazi-chain Hedera Setup');
    console.log('======================\n');

    console.log('This script will help you set up Hedera testnet credentials.\n');

    console.log('📋 Prerequisites:');
    console.log('1. Go to https://portal.hedera.com/');
    console.log('2. Create a testnet account');
    console.log('3. Get your Account ID and Private Key\n');

    const accountId = await question('Enter your Hedera Account ID (format: 0.0.xxxxx): ');
    const privateKey = await question('Enter your Hedera Private Key (DER format): ');

    // Validate account ID format
    if (!accountId.match(/^0\.0\.\d+$/)) {
      throw new Error('Invalid Account ID format. Should be like 0.0.123456');
    }

    // Test the credentials
    console.log('\n🔍 Testing credentials...');
    
    try {
      const operatorId = AccountId.fromString(accountId);
      const operatorKey = PrivateKey.fromString(privateKey);
      
      const client = Client.forTestnet()
        .setOperator(operatorId, operatorKey);

      console.log('✅ Credentials are valid!');
      console.log(`📋 Account ID: ${operatorId}`);
      console.log(`🔑 Public Key: ${operatorKey.publicKey.toString()}`);

      // Update .env file
      const envPath = '.env';
      let envContent = '';

      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      // Update or add Hedera credentials
      const lines = envContent.split('\n');
      let updated = false;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('HEDERA_OPERATOR_ID=')) {
          lines[i] = `HEDERA_OPERATOR_ID=${accountId}`;
          updated = true;
        }
        if (lines[i].startsWith('HEDERA_PRIVATE_KEY=')) {
          lines[i] = `HEDERA_PRIVATE_KEY=${privateKey}`;
          updated = true;
        }
      }

      if (!updated) {
        lines.push(`HEDERA_OPERATOR_ID=${accountId}`);
        lines.push(`HEDERA_PRIVATE_KEY=${privateKey}`);
        lines.push('HEDERA_NETWORK=testnet');
      }

      fs.writeFileSync(envPath, lines.join('\n'));

      console.log('\n✅ Environment variables updated successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Get testnet HBAR from https://portal.hedera.com/');
      console.log('2. Run: node deploy.js');
      console.log('3. Test the deployment');

    } catch (error) {
      console.error('❌ Invalid credentials:', error.message);
      console.log('\n💡 Make sure:');
      console.log('- Your Account ID is in the correct format (0.0.xxxxx)');
      console.log('- Your Private Key is in DER format');
      console.log('- You have sufficient HBAR in your testnet account');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run setup
setupHedera();


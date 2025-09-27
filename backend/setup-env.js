import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

// Default environment configuration
const defaultEnv = `# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Hedera Configuration
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420your-private-key-here
HEDERA_CONTRACT_ID=0.0.1503827
HEDERA_FACTORY_CONTRACT_ID=0.0.1503828
HEDERA_NETWORK=testnet

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Pinata Configuration (IPFS)
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-api-key
PINATA_JWT=your-pinata-jwt-token

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Redis Configuration (for caching and queues)
REDIS_URL=redis://localhost:6379

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
`;

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file with default configuration...');
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('⚠️  IMPORTANT: Please update the following values in .env:');
  console.log('   - SUPABASE_URL and keys');
  console.log('   - HEDERA_OPERATOR_ID and HEDERA_PRIVATE_KEY');
  console.log('   - OPENAI_API_KEY');
  console.log('   - PINATA_API_KEY and related keys');
  console.log('');
} else {
  console.log('✅ .env file already exists');
}

// Create uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Created uploads directory');
}

console.log('🚀 Environment setup complete!');

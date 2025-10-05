import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Import routes
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/property.js';
import transactionRoutes from './routes/transactions.js';
import aiRoutes from './routes/ai.js';
import hederaRoutes from './routes/hedera.js';
import daoRoutes from './routes/dao.js';
import testRoutes from './routes/test.js';

// Import services
import { HederaService } from './services/hedera.js';
import { AIService } from './services/ai.js';
import { PropertyService } from './services/property.js';
import { logger } from './utils/logger.js';

// Import types
import { SupabaseClientType, Database, ApiResponse } from './types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
export const hederaService = new HederaService();
export const aiService = new AIService();
export const propertyService = new PropertyService();

// Initialize Supabase
export const supabase: SupabaseClientType = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        hedera: {
          connected: hederaService.isConnected(),
          fullFunctionality: hederaService.hasFullFunctionality(),
          contracts: hederaService.isConnected() ? 6 : 0
        },
        ai: aiService.isAvailable(),
        database: 'connected'
      },
      network: {
        name: 'Hedera Testnet',
        rpcUrl: 'https://testnet.hashio.io/api',
        chainId: 296
      }
    }
  };
  res.json(response);
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/hedera', hederaRoutes);
app.use('/api/dao', daoRoutes);
app.use('/api/test', testRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Unhandled error:', err);
  
  const errorResponse: ApiResponse = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  };

  if ((err as any).type === 'entity.parse.failed') {
    errorResponse.error = 'Invalid JSON payload';
    res.status(400).json(errorResponse);
    return;
  }

  res.status((err as any).status || 500).json(errorResponse);
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: 'Endpoint not found'
  };
  res.status(404).json(response);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 CHAZI ESTATE Backend Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;


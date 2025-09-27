import express, { Request, Response } from 'express';
import { hederaService } from '../server.js';
import { logger } from '../utils/logger.js';
import { authenticateUser } from '../middleware/auth.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

const router = express.Router();

// Get Hedera service health
router.get('/health', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const isConnected = hederaService.isConnected();
    
    res.json({
      success: true,
      data: {
        connected: isConnected,
        service: 'Hedera Service',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to check Hedera health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check Hedera health'
    });
  }
});

// Get user portfolio from blockchain
router.get('/portfolio', authenticateUser, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user.wallet_address) {
      return res.status(400).json({
        success: false,
        error: 'User wallet address not found'
      });
    }

    // This would typically fetch from blockchain
    // For now, return empty portfolio
    res.json({
      success: true,
      data: {
        wallet_address: req.user.wallet_address,
        properties: [],
        total_value: 0
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to get user portfolio:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user portfolio'
    });
  }
});

// Get property info from blockchain
router.get('/property/:propertyId', async (req: Request<{ propertyId: string }>, res: Response<ApiResponse>) => {
  try {
    const { propertyId } = req.params;
    const propertyInfo = await hederaService.getPropertyInfo(propertyId);
    
    res.json({
      success: true,
      data: propertyInfo
    });
  } catch (error: any) {
    logger.error('❌ Failed to get property info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property info'
    });
  }
});

// Get account balance
router.get('/balance/:accountId', async (req: Request<{ accountId: string }>, res: Response<ApiResponse>) => {
  try {
    const { accountId } = req.params;
    
    // This would get balance from Hedera
    // For now, return mock data
    res.json({
      success: true,
      data: {
        accountId,
        balance: '1000.0',
        currency: 'HBAR'
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to get account balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get account balance'
    });
  }
});

// Get transaction status
router.get('/transaction/:transactionId', async (req: Request<{ transactionId: string }>, res: Response<ApiResponse>) => {
  try {
    const { transactionId } = req.params;
    
    // This would check transaction status on Hedera
    // For now, return mock data
    res.json({
      success: true,
      data: {
        transactionId,
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to get transaction status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get transaction status'
    });
  }
});

// Deploy contract
router.post('/deploy-contract', 
  authenticateUser,
  async (req: AuthenticatedRequest<{}, ApiResponse, { bytecode: string; gas?: number }>, res: Response<ApiResponse>) => {
    try {
      const { bytecode, gas = 3000000 } = req.body;
      
      if (!bytecode) {
        return res.status(400).json({
          success: false,
          error: 'Contract bytecode is required'
        });
      }

      const contractId = await hederaService.deployContract(bytecode, gas);
      
      res.json({
        success: true,
        data: {
          contractId: contractId.toString(),
          gas
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to deploy contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deploy contract'
      });
    }
  }
);

// Call contract function
router.post('/call-contract',
  authenticateUser,
  async (req: AuthenticatedRequest<{}, ApiResponse, { 
    contractId: string; 
    functionName: string; 
    params: any[]; 
    gas?: number 
  }>, res: Response<ApiResponse>) => {
    try {
      const { contractId, functionName, params = [], gas = 1000000 } = req.body;
      
      if (!contractId || !functionName) {
        return res.status(400).json({
          success: false,
          error: 'Contract ID and function name are required'
        });
      }

      const result = await hederaService.callContractFunction(contractId as any, functionName, params, gas);
      
      res.json({
        success: true,
        data: {
          contractId,
          functionName,
          transactionId: (result as any).response?.transactionId?.toString(),
          gas
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to call contract function:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to call contract function'
      });
    }
  }
);

// Query contract function
router.post('/query-contract',
  async (req: Request<{}, ApiResponse, { 
    contractId: string; 
    functionName: string; 
    params: any[] 
  }>, res: Response<ApiResponse>) => {
    try {
      const { contractId, functionName, params = [] } = req.body;
      
      if (!contractId || !functionName) {
        return res.status(400).json({
          success: false,
          error: 'Contract ID and function name are required'
        });
      }

      const result = await hederaService.queryContractFunction(contractId as any, functionName, params);
      
      res.json({
        success: true,
        data: {
          contractId,
          functionName,
          result
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to query contract function:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to query contract function'
      });
    }
  }
);

export default router;

import express, { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { hederaService } from '../server.js';
import { ApiResponse } from '../types/index.js';

const router = express.Router();

// Test contract connectivity
router.get('/contracts', async (req: Request, res: Response) => {
  try {
    const response: ApiResponse = {
      success: true,
      data: {
        hederaConnected: hederaService.isConnected(),
        hasFullFunctionality: hederaService.hasFullFunctionality(),
        contractAddresses: {
          PropertyFactory: '0x670782a6158782157bd0DD251152c075f767689D',
          PropertyDeed: '0xDD03A05cC7A5743b5bd40CA6030A9B227d1a8D0B',
          PropertyToken: '0x0636b2c3241e32Be3dD768C063D278d9ba7bbcB1',
          DeedDAO: '0xe05E191363F3c4c6457148479415D861d261ee2a',
          RevenueDistributor: '0xd63F3f7a51CbBF73447676d622CFe380bbbd4a5a',
          LoanManager: '0x05a1e50ceBad9baB94f9CA47f909289332E6F2D9',
        },
        network: {
          name: 'Hedera Testnet',
          rpcUrl: 'https://testnet.hashio.io/api',
          chainId: 296,
          explorerUrl: 'https://hashscan.io/testnet'
        }
      }
    };
    
    res.json(response);
  } catch (error) {
    logger.error('Error in /test/contracts:', error);
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(errorResponse);
  }
});

// Test contract query
router.get('/contracts/property/:id', async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.id;
    
    if (!hederaService.isConnected()) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Hedera service not connected'
      };
      return res.status(503).json(errorResponse);
    }

    // Try to query the contract
    const result = await hederaService.getPropertyInfo(propertyId);
    
    const response: ApiResponse = {
      success: true,
      data: result
    };
    
    res.json(response);
  } catch (error) {
    logger.error('Error in /test/contracts/property:', error);
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(errorResponse);
  }
});

// Test contract transaction (will fail without credentials)
router.post('/contracts/test-transaction', async (req: Request, res: Response) => {
  try {
    if (!hederaService.hasFullFunctionality()) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Hedera service does not have full functionality. Please configure HEDERA_OPERATOR_ID and HEDERA_PRIVATE_KEY for transactions.'
      };
      return res.status(503).json(errorResponse);
    }

    // This would be a test transaction - for now just return success
    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Transaction functionality available',
        note: 'Configure Hedera credentials to enable actual transactions'
      }
    };
    
    res.json(response);
  } catch (error) {
    logger.error('Error in /test/contracts/test-transaction:', error);
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(errorResponse);
  }
});

export default router;

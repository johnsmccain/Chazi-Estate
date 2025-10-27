import express, { Request, Response } from 'express';
import AIHederaAgent from '../services/ai-hedera-agent.js';
import { logger } from '../utils/logger.js';
import { ApiResponse } from '../types/index.js';

const router = express.Router();
const agent = new AIHederaAgent();

// Chat with AI Hedera Agent
router.post('/chat', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const response = await agent.chat(message, context || {});
    
    res.json({
      success: response.success,
      data: response,
      error: response.success ? undefined : response.message
    });
  } catch (error: any) {
    logger.error('Agent chat failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
});

// Analyze and invest with AI guidance
router.post('/analyze-invest', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { propertyData, investmentAmount, context } = req.body;
    
    if (!propertyData || !investmentAmount) {
      return res.status(400).json({
        success: false,
        error: 'Property data and investment amount are required'
      });
    }

    const response = await agent.analyzeAndInvest(propertyData, investmentAmount, context || {});
    
    res.json({
      success: response.success,
      data: response,
      error: response.success ? undefined : response.message
    });
  } catch (error: any) {
    logger.error('Analyze and invest failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze investment'
    });
  }
});

// Execute smart investment
router.post('/execute-investment', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { propertyId, shares, context } = req.body;
    
    if (!propertyId || !shares) {
      return res.status(400).json({
        success: false,
        error: 'Property ID and shares are required'
      });
    }

    const response = await agent.executeSmartInvestment(propertyId, shares, context || {});
    
    res.json({
      success: response.success,
      data: response,
      error: response.success ? undefined : response.message
    });
  } catch (error: any) {
    logger.error('Execute investment failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute investment'
    });
  }
});

// Monitor market with AI
router.post('/monitor-market', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { location, propertyType } = req.body;
    
    const response = await agent.monitorMarket(
      location || 'Global',
      propertyType || 'All'
    );
    
    res.json({
      success: response.success,
      data: response,
      error: response.success ? undefined : response.message
    });
  } catch (error: any) {
    logger.error('Market monitoring failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to monitor market'
    });
  }
});

// Check contract health
router.get('/contract-health', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const response = await agent.checkContractHealth();
    
    res.json({
      success: response.success,
      data: response,
      error: response.success ? undefined : response.message
    });
  } catch (error: any) {
    logger.error('Contract health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check contract health'
    });
  }
});

// Get portfolio status
router.get('/portfolio/:address', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'User address is required'
      });
    }

    const response = await agent.getPortfolioStatus(address);
    
    res.json({
      success: response.success,
      data: response,
      error: response.success ? undefined : response.message
    });
  } catch (error: any) {
    logger.error('Portfolio status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get portfolio status'
    });
  }
});

// Agent health check
router.get('/health', (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    data: {
      available: agent.isAvailable(),
      service: 'AI Hedera Agent',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
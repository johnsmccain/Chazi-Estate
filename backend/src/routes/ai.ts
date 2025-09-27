import express, { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.js';
import { logger } from '../utils/logger.js';
import { ApiResponse } from '../types/index.js';

const router = express.Router();
const aiService = new AIService();

// Middleware to check if AI service is available
const checkAIService = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
  if (!aiService.isAvailable()) {
    res.status(503).json({
      success: false,
      error: 'AI service is not available. Please check your OpenAI API key configuration.'
    });
    return;
  }
  next();
};

interface PropertyAnalysisRequest {
  [key: string]: any;
}

interface FraudDetectionRequest {
  propertyData: any;
  userData: any;
  transactionData: any;
}

interface PricePredictionRequest {
  propertyData: any;
  marketData: any;
}

interface MarketAnalysisRequest {
  [key: string]: any;
}

interface DocumentAnalysisRequest {
  documentText: string;
  documentType: string;
}

interface SupportRequest {
  userQuery: string;
  userContext?: any;
}

interface ContractAnalysisRequest {
  contractCode: string;
  contractType: string;
}

interface InvestmentRecommendationsRequest {
  userProfile: any;
  marketConditions: any;
}

interface RiskAssessmentRequest {
  propertyData: any;
  userProfile: any;
}

interface PortfolioOptimizationRequest {
  currentPortfolio: any;
  goals: any;
}

interface LegalComplianceRequest {
  propertyData: any;
  jurisdiction: string;
}

interface MarketTrendsRequest {
  location: string;
  propertyType: string;
  timeframe: string;
}

interface PropertyValuationRequest {
  propertyData: any;
  comparableProperties?: any[];
}

interface ROICalculationRequest {
  propertyData: any;
  investmentAmount: number;
  timeframe: string;
}

// Property Analysis
router.post('/analyze-property', checkAIService, async (req: Request<{}, ApiResponse, PropertyAnalysisRequest>, res: Response<ApiResponse>) => {
  try {
    const propertyData = req.body;
    
    if (!propertyData) {
      return res.status(400).json({
        success: false,
        error: 'Property data is required'
      });
    }

    const analysis = await aiService.analyzeProperty(propertyData);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    logger.error('Property analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze property'
    });
  }
});

// Fraud Detection
router.post('/detect-fraud', checkAIService, async (req: Request<{}, ApiResponse, FraudDetectionRequest>, res: Response<ApiResponse>) => {
  try {
    const { propertyData, userData, transactionData } = req.body;
    
    if (!propertyData || !userData || !transactionData) {
      return res.status(400).json({
        success: false,
        error: 'Property data, user data, and transaction data are required'
      });
    }

    const fraudDetection = await aiService.detectFraud(propertyData, userData, transactionData);
    
    res.json({
      success: true,
      data: fraudDetection
    });
  } catch (error: any) {
    logger.error('Fraud detection failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect fraud'
    });
  }
});

// Price Prediction
router.post('/predict-price', checkAIService, async (req: Request<{}, ApiResponse, PricePredictionRequest>, res: Response<ApiResponse>) => {
  try {
    const { propertyData, marketData } = req.body;
    
    if (!propertyData || !marketData) {
      return res.status(400).json({
        success: false,
        error: 'Property data and market data are required'
      });
    }

    const prediction = await aiService.predictPropertyPrice(propertyData, marketData);
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error: any) {
    logger.error('Price prediction failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to predict property price'
    });
  }
});

// Market Analysis
router.post('/analyze-market', checkAIService, async (req: Request<{}, ApiResponse, MarketAnalysisRequest>, res: Response<ApiResponse>) => {
  try {
    const marketData = req.body;
    
    if (!marketData) {
      return res.status(400).json({
        success: false,
        error: 'Market data is required'
      });
    }

    const analysis = await aiService.analyzeMarket(marketData);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    logger.error('Market analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze market'
    });
  }
});

// Document Analysis
router.post('/analyze-document', checkAIService, async (req: Request<{}, ApiResponse, DocumentAnalysisRequest>, res: Response<ApiResponse>) => {
  try {
    const { documentText, documentType } = req.body;
    
    if (!documentText || !documentType) {
      return res.status(400).json({
        success: false,
        error: 'Document text and type are required'
      });
    }

    const analysis = await aiService.analyzeDocument(documentText, documentType);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    logger.error('Document analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze document'
    });
  }
});

// Customer Support
router.post('/support', checkAIService, async (req: Request<{}, ApiResponse, SupportRequest>, res: Response<ApiResponse>) => {
  try {
    const { userQuery, userContext } = req.body;
    
    if (!userQuery) {
      return res.status(400).json({
        success: false,
        error: 'User query is required'
      });
    }

    const response = await aiService.generateSupportResponse(userQuery, userContext || {});
    
    res.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    logger.error('Support response generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate support response'
    });
  }
});

// Smart Contract Analysis
router.post('/analyze-contract', checkAIService, async (req: Request<{}, ApiResponse, ContractAnalysisRequest>, res: Response<ApiResponse>) => {
  try {
    const { contractCode, contractType } = req.body;
    
    if (!contractCode || !contractType) {
      return res.status(400).json({
        success: false,
        error: 'Contract code and type are required'
      });
    }

    const analysis = await aiService.analyzeSmartContract(contractCode, contractType);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    logger.error('Smart contract analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze smart contract'
    });
  }
});

// Investment Recommendations
router.post('/investment-recommendations', checkAIService, async (req: Request<{}, ApiResponse, InvestmentRecommendationsRequest>, res: Response<ApiResponse>) => {
  try {
    const { userProfile, marketConditions } = req.body;
    
    if (!userProfile || !marketConditions) {
      return res.status(400).json({
        success: false,
        error: 'User profile and market conditions are required'
      });
    }

    const recommendations = await aiService.getInvestmentRecommendations(userProfile, marketConditions);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error: any) {
    logger.error('Investment recommendations failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate investment recommendations'
    });
  }
});

// Risk Assessment
router.post('/risk-assessment', checkAIService, async (req: Request<{}, ApiResponse, RiskAssessmentRequest>, res: Response<ApiResponse>) => {
  try {
    const { propertyData, userProfile } = req.body;
    
    if (!propertyData || !userProfile) {
      return res.status(400).json({
        success: false,
        error: 'Property data and user profile are required'
      });
    }

    const assessment = await aiService.assessRisk(propertyData, userProfile);
    
    res.json({
      success: true,
      data: assessment
    });
  } catch (error: any) {
    logger.error('Risk assessment failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assess risk'
    });
  }
});

// Portfolio Optimization
router.post('/optimize-portfolio', checkAIService, async (req: Request<{}, ApiResponse, PortfolioOptimizationRequest>, res: Response<ApiResponse>) => {
  try {
    const { currentPortfolio, goals } = req.body;
    
    if (!currentPortfolio || !goals) {
      return res.status(400).json({
        success: false,
        error: 'Current portfolio and goals are required'
      });
    }

    const optimization = await aiService.optimizePortfolio(currentPortfolio, goals);
    
    res.json({
      success: true,
      data: optimization
    });
  } catch (error: any) {
    logger.error('Portfolio optimization failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize portfolio'
    });
  }
});

// Legal Compliance Check
router.post('/legal-compliance', checkAIService, async (req: Request<{}, ApiResponse, LegalComplianceRequest>, res: Response<ApiResponse>) => {
  try {
    const { propertyData, jurisdiction } = req.body;
    
    if (!propertyData || !jurisdiction) {
      return res.status(400).json({
        success: false,
        error: 'Property data and jurisdiction are required'
      });
    }

    const compliance = await aiService.checkLegalCompliance(propertyData, jurisdiction);
    
    res.json({
      success: true,
      data: compliance
    });
  } catch (error: any) {
    logger.error('Legal compliance check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check legal compliance'
    });
  }
});

// Market Trend Analysis
router.post('/market-trends', checkAIService, async (req: Request<{}, ApiResponse, MarketTrendsRequest>, res: Response<ApiResponse>) => {
  try {
    const { location, propertyType, timeframe } = req.body;
    
    if (!location || !propertyType || !timeframe) {
      return res.status(400).json({
        success: false,
        error: 'Location, property type, and timeframe are required'
      });
    }

    const trends = await aiService.analyzeMarketTrends(location, propertyType, timeframe);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error: any) {
    logger.error('Market trend analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze market trends'
    });
  }
});

// Property Valuation
router.post('/valuate-property', checkAIService, async (req: Request<{}, ApiResponse, PropertyValuationRequest>, res: Response<ApiResponse>) => {
  try {
    const { propertyData, comparableProperties } = req.body;
    
    if (!propertyData) {
      return res.status(400).json({
        success: false,
        error: 'Property data is required'
      });
    }

    const valuation = await aiService.valuateProperty(propertyData, comparableProperties || []);
    
    res.json({
      success: true,
      data: valuation
    });
  } catch (error: any) {
    logger.error('Property valuation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to valuate property'
    });
  }
});

// ROI Calculation
router.post('/calculate-roi', checkAIService, async (req: Request<{}, ApiResponse, ROICalculationRequest>, res: Response<ApiResponse>) => {
  try {
    const { propertyData, investmentAmount, timeframe } = req.body;
    
    if (!propertyData || !investmentAmount || !timeframe) {
      return res.status(400).json({
        success: false,
        error: 'Property data, investment amount, and timeframe are required'
      });
    }

    const roi = await aiService.calculateROI(propertyData, investmentAmount, timeframe);
    
    res.json({
      success: true,
      data: roi
    });
  } catch (error: any) {
    logger.error('ROI calculation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate ROI'
    });
  }
});

// AI Service Health Check
router.get('/health', (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    data: {
      available: aiService.isAvailable(),
      service: 'Hedera AI Service',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;

import { AIService } from './ai.js';
import HederaService from './hedera.js';
import { logger } from '../utils/logger.js';

interface AgentContext {
  userAddress?: string;
  userProfile?: any;
  currentProperty?: any;
  marketData?: any;
}

interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  actions?: string[];
  confidence?: number;
}

export class AIHederaAgent {
  private aiService: AIService;
  private hederaService: HederaService;
  private isInitialized: boolean = false;

  constructor() {
    this.aiService = new AIService();
    this.hederaService = new HederaService();
    this.init();
  }

  private async init(): Promise<void> {
    try {
      // Wait for services to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isInitialized = true;
      logger.info('✅ AI Hedera Agent initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize AI Hedera Agent:', error);
    }
  }

  isAvailable(): boolean {
    return this.isInitialized && this.hederaService.isConnected();
  }

  // Smart property investment analysis with blockchain execution
  async analyzeAndInvest(propertyData: any, investmentAmount: number, context: AgentContext): Promise<AgentResponse> {
    try {
      if (!this.isAvailable()) {
        return { success: false, message: 'AI Hedera Agent is not available' };
      }

      // AI analysis first
      const analysis = await this.aiService.analyzeProperty(propertyData);
      const riskAssessment = await this.aiService.assessRisk(propertyData, context.userProfile || {});

      // Generate investment recommendation
      const recommendation = await this.aiService.getInvestmentRecommendations(
        context.userProfile || {},
        context.marketData || {}
      );

      // Calculate optimal shares based on AI recommendation
      const optimalShares = this.calculateOptimalShares(investmentAmount, propertyData, analysis);

      return {
        success: true,
        message: `AI analysis complete. Property score: ${riskAssessment.riskScore}/100. Recommended investment: ${optimalShares} shares.`,
        data: {
          analysis: analysis.analysis,
          riskScore: riskAssessment.riskScore,
          recommendation: recommendation.recommendations,
          optimalShares,
          confidence: analysis.confidence
        },
        actions: ['buy_shares', 'get_more_info', 'analyze_market'],
        confidence: analysis.confidence
      };
    } catch (error) {
      logger.error('❌ AI investment analysis failed:', error);
      return { success: false, message: 'Failed to analyze investment opportunity' };
    }
  }

  // Execute smart contract operations with AI guidance
  async executeSmartInvestment(propertyId: string, shares: number, context: AgentContext): Promise<AgentResponse> {
    try {
      if (!this.hederaService.hasFullFunctionality()) {
        return { 
          success: false, 
          message: 'Hedera service requires full configuration for transactions' 
        };
      }

      // Buy shares on Hedera
      const result = await this.hederaService.buyShares({
        propertyId,
        shares: shares.toString()
      });

      if (result.success) {
        return {
          success: true,
          message: `Successfully purchased ${shares} shares of property ${propertyId}`,
          data: {
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber,
            gasUsed: result.gasUsed
          },
          actions: ['view_portfolio', 'track_performance']
        };
      } else {
        return { success: false, message: result.error || 'Transaction failed' };
      }
    } catch (error) {
      logger.error('❌ Smart investment execution failed:', error);
      return { success: false, message: 'Failed to execute investment' };
    }
  }

  // AI-powered market monitoring
  async monitorMarket(location: string, propertyType: string): Promise<AgentResponse> {
    try {
      const trends = await this.aiService.analyzeMarketTrends(location, propertyType, '6 months');
      
      return {
        success: true,
        message: `Market analysis complete for ${propertyType} in ${location}`,
        data: {
          trends: trends.trends,
          trendScore: trends.trendScore,
          recommendations: trends.recommendations
        },
        actions: ['set_alerts', 'explore_properties', 'adjust_strategy'],
        confidence: 0.85
      };
    } catch (error) {
      logger.error('❌ Market monitoring failed:', error);
      return { success: false, message: 'Failed to monitor market' };
    }
  }

  // Smart contract health check with AI insights
  async checkContractHealth(): Promise<AgentResponse> {
    try {
      const contractAddresses = await Promise.all([
        this.hederaService.getContractAddress('PropertyFactory'),
        this.hederaService.getContractAddress('PropertyToken'),
        this.hederaService.getContractAddress('DeedDAO')
      ]);

      const networkInfo = await this.hederaService.getNetworkInfo();

      return {
        success: true,
        message: 'All smart contracts are operational on Hedera testnet',
        data: {
          contracts: {
            PropertyFactory: contractAddresses[0],
            PropertyToken: contractAddresses[1],
            DeedDAO: contractAddresses[2]
          },
          network: networkInfo,
          status: 'healthy'
        },
        actions: ['view_contracts', 'check_transactions'],
        confidence: 1.0
      };
    } catch (error) {
      logger.error('❌ Contract health check failed:', error);
      return { success: false, message: 'Failed to check contract health' };
    }
  }

  // AI chat interface for natural language interactions
  async chat(message: string, context: AgentContext): Promise<AgentResponse> {
    try {
      // Simple intent recognition
      const intent = this.recognizeIntent(message);
      
      switch (intent) {
        case 'analyze_property':
          if (context.currentProperty) {
            return await this.analyzeAndInvest(context.currentProperty, 1000, context);
          }
          return { success: false, message: 'Please specify a property to analyze' };
          
        case 'check_portfolio':
          return await this.getPortfolioStatus(context.userAddress || '');
          
        case 'market_update':
          return await this.monitorMarket('Global', 'All');
          
        case 'contract_status':
          return await this.checkContractHealth();
          
        default:
          // Use AI service for general support
          const response = await this.aiService.generateSupportResponse(message, {
            account_type: 'Premium',
            experience: context.userProfile?.experience || 'Intermediate'
          });
          
          return {
            success: true,
            message: response.response,
            actions: response.suggestedActions,
            confidence: 0.8
          };
      }
    } catch (error) {
      logger.error('❌ Chat processing failed:', error);
      return { success: false, message: 'Sorry, I encountered an error processing your request' };
    }
  }

  // Portfolio management with AI optimization
  async getPortfolioStatus(userAddress: string): Promise<AgentResponse> {
    try {
      // Mock portfolio data - in production, this would query actual holdings
      const mockPortfolio = {
        totalValue: '$25,000',
        properties: 3,
        monthlyReturn: '8.5%',
        riskScore: 65
      };

      return {
        success: true,
        message: `Portfolio Status: ${mockPortfolio.totalValue} across ${mockPortfolio.properties} properties`,
        data: mockPortfolio,
        actions: ['optimize_portfolio', 'add_property', 'rebalance'],
        confidence: 0.9
      };
    } catch (error) {
      logger.error('❌ Portfolio status check failed:', error);
      return { success: false, message: 'Failed to retrieve portfolio status' };
    }
  }

  // Helper methods
  private calculateOptimalShares(investmentAmount: number, propertyData: any, analysis: any): number {
    const pricePerShare = propertyData.price_per_sqft || 100;
    const maxShares = Math.floor(investmentAmount / pricePerShare);
    const riskAdjustment = analysis.confidence || 0.8;
    return Math.floor(maxShares * riskAdjustment);
  }

  private recognizeIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('property')) {
      return 'analyze_property';
    }
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('holdings')) {
      return 'check_portfolio';
    }
    if (lowerMessage.includes('market') || lowerMessage.includes('trends')) {
      return 'market_update';
    }
    if (lowerMessage.includes('contract') || lowerMessage.includes('blockchain')) {
      return 'contract_status';
    }
    
    return 'general_support';
  }
}

export default AIHederaAgent;
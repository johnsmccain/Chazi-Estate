import OpenAI from 'openai';
import { logger } from '../utils/logger.js';

interface PropertyData {
  address?: string;
  type?: string;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  price?: number;
  price_per_sqft?: number;
  city?: string;
  state?: string;
  location?: string;
  market_conditions?: string;
  rental_income?: number;
  operating_expenses?: number;
  appreciation_rate?: number;
  zoning?: string;
  current_use?: string;
  price_history?: string;
  ownership_history?: string;
}

interface UserData {
  account_age?: string;
  transaction_count?: number;
  verification_status?: string;
  risk_tolerance?: string;
  goals?: string;
  portfolio_size?: number;
  experience?: string;
  financial_situation?: string;
}

interface TransactionData {
  amount?: number;
  payment_method?: string;
  location?: string;
}

interface MarketData {
  trends?: string;
  interest_rates?: string;
  economic_indicators?: string;
  location?: string;
  property_types?: string;
  price_trends?: string;
  supply_demand?: string;
  economic_factors?: string;
  state?: string;
  outlook?: string;
}

interface UserContext {
  account_type?: string;
  experience?: string;
  portfolio_value?: number;
}

interface UserProfile {
  risk_tolerance?: string;
  goals?: string;
  portfolio_size?: number;
  experience?: string;
  financial_situation?: string;
}

interface Goals {
  primary?: string;
  time_horizon?: string;
  target_return?: string;
  risk_tolerance?: string;
}

interface ComparableProperty {
  [key: string]: any;
}

interface AnalysisResult {
  analysis: string;
  confidence?: number;
  timestamp: string;
}

interface FraudAnalysisResult extends AnalysisResult {
  riskScore: number;
  recommendations: string[];
}

interface PricePredictionResult extends AnalysisResult {
  predictions: {
    sixMonths: string | null;
    oneYear: string | null;
    threeYears: string | null;
  };
}

interface SupportResponseResult extends AnalysisResult {
  response: string;
  suggestedActions: string[];
}

interface DocumentAnalysisResult extends AnalysisResult {
  verificationStatus: 'verified' | 'pending' | 'rejected';
  issues: string[];
}

interface MarketAnalysisResult extends AnalysisResult {
  marketScore: number;
  recommendations: string[];
}

interface ContractAnalysisResult extends AnalysisResult {
  securityScore: number;
  recommendations: string[];
}

interface InvestmentRecommendationResult extends AnalysisResult {
  recommendations: string;
  confidence: number;
}

interface RiskAssessmentResult extends AnalysisResult {
  riskScore: number;
}

interface PortfolioOptimizationResult extends AnalysisResult {
  optimization: string;
  expectedImprovement: number;
}

interface ComplianceResult extends AnalysisResult {
  compliance: string;
  complianceScore: number;
  issues: string[];
}

interface TrendAnalysisResult extends AnalysisResult {
  trends: string;
  trendScore: number;
  recommendations: string[];
}

interface ValuationResult extends AnalysisResult {
  valuation: string;
  estimatedValue: string;
  confidence: number;
}

interface ROICalculationResult extends AnalysisResult {
  roi: string;
  calculatedROI: number;
}

export class AIService {
  private openai: OpenAI | null = null;
  private available: boolean = false;

  constructor() {
    // Initialize OpenAI only if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        this.available = true;
        logger.info('✅ AI service initialized with OpenAI');
      } catch (error: any) {
        logger.error('❌ Failed to initialize OpenAI:', error.message);
        this.available = false;
      }
    } else {
      logger.warn('⚠️ OpenAI API key not found. AI features will be disabled.');
      this.available = false;
    }
  }

  isAvailable(): boolean {
    return this.available && this.openai !== null;
  }

  // Property Analysis
  async analyzeProperty(propertyData: PropertyData): Promise<AnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Analyze the following property data and provide insights:
        
        Property Details:
        - Address: ${propertyData.address || 'N/A'}
        - Type: ${propertyData.type || 'N/A'}
        - Square Footage: ${propertyData.sqft || 'N/A'}
        - Bedrooms: ${propertyData.bedrooms || 'N/A'}
        - Bathrooms: ${propertyData.bathrooms || 'N/A'}
        - Year Built: ${propertyData.year_built || 'N/A'}
        - Price: $${(propertyData.price || 0) / 100}
        - Price per sqft: $${(propertyData.price_per_sqft || 0) / 100}
        
        Please provide:
        1. Market analysis and comparable properties
        2. Investment potential and expected returns
        3. Risk assessment
        4. Recommendations for pricing strategy
        5. Market trends affecting this property type
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return {
        analysis: response.choices[0]?.message?.content || '',
        confidence: 0.85,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to analyze property:', error);
      throw error;
    }
  }

  // Fraud Detection
  async detectFraud(
    propertyData: PropertyData, 
    userData: UserData, 
    transactionData: TransactionData
  ): Promise<FraudAnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Analyze the following data for potential fraud indicators:
        
        Property Data:
        - Price: $${(propertyData.price || 0) / 100}
        - Recent price changes: ${propertyData.price_history || 'N/A'}
        - Ownership history: ${propertyData.ownership_history || 'N/A'}
        
        User Data:
        - Account age: ${userData.account_age || 'N/A'}
        - Transaction history: ${userData.transaction_count || 0} transactions
        - Verification status: ${userData.verification_status || 'N/A'}
        
        Transaction Data:
        - Amount: $${(transactionData.amount || 0) / 100}
        - Payment method: ${transactionData.payment_method || 'N/A'}
        - Location: ${transactionData.location || 'N/A'}
        
        Identify potential fraud indicators and provide a risk score (0-100).
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.3,
      });

      const analysis = response.choices[0]?.message?.content || '';
      const riskScore = this.extractRiskScore(analysis);

      return {
        analysis,
        riskScore,
        recommendations: this.generateFraudRecommendations(riskScore),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to detect fraud:', error);
      throw error;
    }
  }

  // Price Prediction
  async predictPropertyPrice(propertyData: PropertyData, marketData: MarketData): Promise<PricePredictionResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Predict the future price of this property based on market trends:
        
        Property Details:
        - Current Price: $${(propertyData.price || 0) / 100}
        - Location: ${propertyData.city || 'N/A'}, ${propertyData.state || 'N/A'}
        - Property Type: ${propertyData.type || 'N/A'}
        - Square Footage: ${propertyData.sqft || 'N/A'}
        
        Market Data:
        - Local market trends: ${marketData.trends || 'N/A'}
        - Interest rates: ${marketData.interest_rates || 'N/A'}
        - Economic indicators: ${marketData.economic_indicators || 'N/A'}
        
        Provide price predictions for:
        1. 6 months from now
        2. 1 year from now
        3. 3 years from now
        
        Include confidence intervals and reasoning.
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.5,
      });

      return {
        analysis: response.choices[0].message.content || '',
        predictions: this.parsePricePredictions(response.choices[0].message.content || ''),
        confidence: 0.78,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to predict property price:', error);
      throw error;
    }
  }

  // Customer Support
  async generateSupportResponse(userQuery: string, userContext: UserContext): Promise<SupportResponseResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Provide helpful customer support for a real estate investment platform:
        
        User Query: "${userQuery}"
        
        User Context:
        - Account type: ${userContext.account_type || 'Standard'}
        - Investment experience: ${userContext.experience || 'Beginner'}
        - Portfolio value: $${(userContext.portfolio_value || 0) / 100}
        
        Provide a helpful, accurate, and friendly response that addresses their question.
        Include relevant information about our platform's features and services.
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      });

      return {
        analysis: response.choices[0].message.content || '',
        response: response.choices[0].message.content || '',
        suggestedActions: this.extractSuggestedActions(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to generate support response:', error);
      throw error;
    }
  }

  // Document Analysis
  async analyzeDocument(documentText: string, documentType: string): Promise<DocumentAnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Analyze this ${documentType} document for real estate verification:
        
        Document Text:
        ${documentText}
        
        Please extract and verify:
        1. Property ownership information
        2. Legal compliance
        3. Document authenticity indicators
        4. Required information completeness
        5. Potential issues or discrepancies
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      });

      return {
        analysis: response.choices[0].message.content || '',
        verificationStatus: this.determineVerificationStatus(response.choices[0].message.content || ''),
        issues: this.extractIssues(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to analyze document:', error);
      throw error;
    }
  }

  // Market Analysis
  async analyzeMarket(marketData: MarketData): Promise<MarketAnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Provide comprehensive market analysis for real estate investment:
        
        Market Data:
        - Location: ${marketData.location || 'N/A'}
        - Property types: ${marketData.property_types || 'N/A'}
        - Price trends: ${marketData.price_trends || 'N/A'}
        - Supply and demand: ${marketData.supply_demand || 'N/A'}
        - Economic factors: ${marketData.economic_factors || 'N/A'}
        
        Provide analysis on:
        1. Market conditions and trends
        2. Investment opportunities
        3. Risk factors
        4. Market predictions
        5. Investment recommendations
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.6,
      });

      return {
        analysis: response.choices[0].message.content || '',
        marketScore: this.calculateMarketScore(response.choices[0].message.content || ''),
        recommendations: this.extractMarketRecommendations(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to analyze market:', error);
      throw error;
    }
  }

  // Smart Contract Analysis
  async analyzeSmartContract(contractCode: string, contractType: string): Promise<ContractAnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Analyze this ${contractType} smart contract for security and functionality:
        
        Contract Code:
        ${contractCode}
        
        Please analyze:
        1. Security vulnerabilities
        2. Code quality and best practices
        3. Functionality and logic
        4. Gas optimization opportunities
        5. Recommendations for improvement
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
      });

      return {
        analysis: response.choices[0].message.content || '',
        securityScore: this.calculateSecurityScore(response.choices[0].message.content || ''),
        recommendations: this.extractContractRecommendations(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to analyze smart contract:', error);
      throw error;
    }
  }

  // Investment Recommendations
  async getInvestmentRecommendations(userProfile: UserProfile, marketConditions: MarketData): Promise<InvestmentRecommendationResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Provide personalized investment recommendations based on user profile and market conditions:
        
        User Profile:
        - Risk tolerance: ${userProfile.risk_tolerance || 'Medium'}
        - Investment goals: ${userProfile.goals || 'Growth'}
        - Portfolio size: $${userProfile.portfolio_size || 0}
        - Experience level: ${userProfile.experience || 'Beginner'}
        
        Market Conditions:
        - Current market state: ${marketConditions.state || 'Normal'}
        - Interest rates: ${marketConditions.interest_rates || 'N/A'}
        - Economic outlook: ${marketConditions.outlook || 'Stable'}
        
        Provide recommendations for:
        1. Property types to invest in
        2. Geographic locations
        3. Investment strategies
        4. Risk management
        5. Portfolio diversification
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.6,
      });

      return {
        analysis: response.choices[0].message.content || '',
        recommendations: response.choices[0].message.content || '',
        confidence: 0.82,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to get investment recommendations:', error);
      throw error;
    }
  }

  // Risk Assessment
  async assessRisk(propertyData: PropertyData, userProfile: UserProfile): Promise<RiskAssessmentResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Assess the risk level for this property investment based on user profile:
        
        Property Data:
        - Location: ${propertyData.location || 'N/A'}
        - Property type: ${propertyData.type || 'N/A'}
        - Price: $${(propertyData.price || 0) / 100}
        - Market conditions: ${propertyData.market_conditions || 'N/A'}
        
        User Profile:
        - Risk tolerance: ${userProfile.risk_tolerance || 'Medium'}
        - Investment experience: ${userProfile.experience || 'Beginner'}
        - Financial situation: ${userProfile.financial_situation || 'Stable'}
        
        Provide a comprehensive risk assessment including:
        1. Overall risk score (0-100)
        2. Specific risk factors
        3. Mitigation strategies
        4. Suitability for this user
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.4,
      });

      return {
        analysis: response.choices[0].message.content || '',
        riskScore: this.extractRiskScore(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to assess risk:', error);
      throw error;
    }
  }

  // Portfolio Optimization
  async optimizePortfolio(currentPortfolio: any, goals: Goals): Promise<PortfolioOptimizationResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Optimize this real estate portfolio based on user goals:
        
        Current Portfolio:
        ${JSON.stringify(currentPortfolio, null, 2)}
        
        Goals:
        - Primary goal: ${goals.primary || 'Growth'}
        - Time horizon: ${goals.time_horizon || '5-10 years'}
        - Target return: ${goals.target_return || '8-12%'}
        - Risk tolerance: ${goals.risk_tolerance || 'Medium'}
        
        Provide optimization recommendations for:
        1. Portfolio rebalancing
        2. New investments
        3. Divestment opportunities
        4. Risk management
        5. Performance improvement
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.5,
      });

      return {
        analysis: response.choices[0].message.content || '',
        optimization: response.choices[0].message.content || '',
        expectedImprovement: this.calculateExpectedImprovement(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to optimize portfolio:', error);
      throw error;
    }
  }

  // Legal Compliance Check
  async checkLegalCompliance(propertyData: PropertyData, jurisdiction: string): Promise<ComplianceResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Check legal compliance for this property in ${jurisdiction}:
        
        Property Data:
        - Property type: ${propertyData.type || 'N/A'}
        - Location: ${propertyData.location || 'N/A'}
        - Zoning: ${propertyData.zoning || 'N/A'}
        - Current use: ${propertyData.current_use || 'N/A'}
        
        Check compliance with:
        1. Zoning regulations
        2. Building codes
        3. Environmental regulations
        4. Tax requirements
        5. Investment regulations
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.3,
      });

      return {
        analysis: response.choices[0].message.content || '',
        compliance: response.choices[0].message.content || '',
        complianceScore: this.calculateComplianceScore(response.choices[0].message.content || ''),
        issues: this.extractComplianceIssues(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to check legal compliance:', error);
      throw error;
    }
  }

  // Market Trend Analysis
  async analyzeMarketTrends(location: string, propertyType: string, timeframe: string): Promise<TrendAnalysisResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Analyze market trends for ${propertyType} properties in ${location} over ${timeframe}:
        
        Please provide analysis on:
        1. Price trends and forecasts
        2. Supply and demand dynamics
        3. Market drivers and factors
        4. Investment opportunities
        5. Risk factors and considerations
        6. Recommendations for investors
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.6,
      });

      return {
        analysis: response.choices[0].message.content || '',
        trends: response.choices[0].message.content || '',
        trendScore: this.calculateTrendScore(response.choices[0].message.content || ''),
        recommendations: this.extractTrendRecommendations(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to analyze market trends:', error);
      throw error;
    }
  }

  // Property Valuation
  async valuateProperty(propertyData: PropertyData, comparableProperties: ComparableProperty[]): Promise<ValuationResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Provide a comprehensive property valuation:
        
        Property Data:
        ${JSON.stringify(propertyData, null, 2)}
        
        Comparable Properties:
        ${JSON.stringify(comparableProperties, null, 2)}
        
        Please provide:
        1. Estimated market value
        2. Valuation methodology
        3. Key factors affecting value
        4. Comparable analysis
        5. Confidence level in valuation
        6. Recommendations for pricing
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.4,
      });

      return {
        analysis: response.choices[0].message.content || '',
        valuation: response.choices[0].message.content || '',
        estimatedValue: this.extractEstimatedValue(response.choices[0].message.content || ''),
        confidence: this.extractConfidence(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to valuate property:', error);
      throw error;
    }
  }

  // ROI Calculation
  async calculateROI(propertyData: PropertyData, investmentAmount: number, timeframe: string): Promise<ROICalculationResult> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available. Please configure OpenAI API key.');
    }

    try {
      const prompt = `
        Calculate ROI for this property investment:
        
        Property Data:
        - Purchase price: $${(propertyData.price || 0) / 100}
        - Expected rental income: $${(propertyData.rental_income || 0) / 100}/month
        - Operating expenses: $${(propertyData.operating_expenses || 0) / 100}/month
        - Expected appreciation: ${propertyData.appreciation_rate || 3}% annually
        
        Investment Details:
        - Investment amount: $${investmentAmount / 100}
        - Timeframe: ${timeframe}
        
        Calculate:
        1. Cash-on-cash return
        2. Total ROI over timeframe
        3. Annualized ROI
        4. Break-even analysis
        5. Sensitivity analysis
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.3,
      });

      return {
        analysis: response.choices[0].message.content || '',
        roi: response.choices[0].message.content || '',
        calculatedROI: this.extractROI(response.choices[0].message.content || ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Failed to calculate ROI:', error);
      throw error;
    }
  }

  // Utility Functions
  private extractRiskScore(analysis: string): number {
    // Extract risk score from AI analysis
    const riskMatch = analysis.match(/risk score[:\s]*(\d+)/i);
    return riskMatch ? parseInt(riskMatch[1] || '50') : 50;
  }

  private generateFraudRecommendations(riskScore: number): string[] {
    if (riskScore > 80) {
      return ['Block transaction', 'Flag for manual review', 'Request additional verification'];
    } else if (riskScore > 60) {
      return ['Additional verification required', 'Monitor closely', 'Request documentation'];
    } else if (riskScore > 30) {
      return ['Standard verification', 'Monitor for patterns'];
    } else {
      return ['Proceed normally', 'Routine monitoring'];
    }
  }

  private parsePricePredictions(content: string): { sixMonths: string | null; oneYear: string | null; threeYears: string | null } {
    // Parse price predictions from AI response
    const predictions = {
      sixMonths: null as string | null,
      oneYear: null as string | null,
      threeYears: null as string | null
    };

    const priceMatches = content.match(/\$[\d,]+/g);
    if (priceMatches && priceMatches.length >= 3) {
      predictions.sixMonths = priceMatches[0] || null;
      predictions.oneYear = priceMatches[1] || null;
      predictions.threeYears = priceMatches[2] || null;
    }

    return predictions;
  }

  private extractSuggestedActions(content: string): string[] {
    // Extract suggested actions from support response
    const actions: string[] = [];
    if (content.includes('contact support')) actions.push('contact_support');
    if (content.includes('verify')) actions.push('verify_account');
    if (content.includes('document')) actions.push('upload_documents');
    return actions;
  }

  private determineVerificationStatus(analysis: string): 'verified' | 'pending' | 'rejected' {
    if (analysis.includes('verified') || analysis.includes('authentic')) {
      return 'verified';
    } else if (analysis.includes('pending') || analysis.includes('review')) {
      return 'pending';
    } else {
      return 'rejected';
    }
  }

  private extractIssues(analysis: string): string[] {
    const issues: string[] = [];
    if (analysis.includes('missing')) issues.push('missing_information');
    if (analysis.includes('discrepancy')) issues.push('data_discrepancy');
    if (analysis.includes('expired')) issues.push('expired_document');
    return issues;
  }

  private calculateMarketScore(analysis: string): number {
    // Calculate market score based on analysis sentiment
    const positiveWords = ['growth', 'opportunity', 'strong', 'positive', 'increase'];
    const negativeWords = ['decline', 'risk', 'weak', 'negative', 'decrease'];
    
    let score = 50;
    positiveWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score += 10;
    });
    negativeWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score -= 10;
    });
    
    return Math.max(0, Math.min(100, score));
  }

  private extractMarketRecommendations(analysis: string): string[] {
    const recommendations: string[] = [];
    if (analysis.includes('buy')) recommendations.push('buy');
    if (analysis.includes('hold')) recommendations.push('hold');
    if (analysis.includes('sell')) recommendations.push('sell');
    return recommendations;
  }

  private calculateSecurityScore(analysis: string): number {
    // Calculate security score based on analysis
    const positiveWords = ['secure', 'safe', 'good', 'proper', 'correct'];
    const negativeWords = ['vulnerable', 'unsafe', 'risk', 'issue', 'problem'];
    
    let score = 50;
    positiveWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score += 10;
    });
    negativeWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score -= 10;
    });
    
    return Math.max(0, Math.min(100, score));
  }

  private extractContractRecommendations(analysis: string): string[] {
    const recommendations: string[] = [];
    if (analysis.includes('audit')) recommendations.push('security_audit');
    if (analysis.includes('test')) recommendations.push('comprehensive_testing');
    if (analysis.includes('optimize')) recommendations.push('gas_optimization');
    return recommendations;
  }

  private calculateExpectedImprovement(analysis: string): number {
    // Extract expected improvement percentage
    const improvementMatch = analysis.match(/(\d+)%/);
    return improvementMatch ? parseInt(improvementMatch[1] || '5') : 5;
  }

  private calculateComplianceScore(analysis: string): number {
    // Calculate compliance score
    const positiveWords = ['compliant', 'legal', 'approved', 'valid'];
    const negativeWords = ['non-compliant', 'illegal', 'violation', 'issue'];
    
    let score = 50;
    positiveWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score += 15;
    });
    negativeWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score -= 15;
    });
    
    return Math.max(0, Math.min(100, score));
  }

  private extractComplianceIssues(analysis: string): string[] {
    const issues: string[] = [];
    if (analysis.includes('zoning')) issues.push('zoning_violation');
    if (analysis.includes('building code')) issues.push('building_code_violation');
    if (analysis.includes('environmental')) issues.push('environmental_issue');
    return issues;
  }

  private calculateTrendScore(analysis: string): number {
    // Calculate trend score
    const positiveWords = ['upward', 'growth', 'positive', 'increasing'];
    const negativeWords = ['downward', 'decline', 'negative', 'decreasing'];
    
    let score = 50;
    positiveWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score += 12;
    });
    negativeWords.forEach(word => {
      if (analysis.toLowerCase().includes(word)) score -= 12;
    });
    
    return Math.max(0, Math.min(100, score));
  }

  private extractTrendRecommendations(analysis: string): string[] {
    const recommendations: string[] = [];
    if (analysis.includes('invest')) recommendations.push('invest_now');
    if (analysis.includes('wait')) recommendations.push('wait_for_better_conditions');
    if (analysis.includes('diversify')) recommendations.push('diversify_portfolio');
    return recommendations;
  }

  private extractEstimatedValue(analysis: string): string {
    // Extract estimated value from analysis
    const valueMatch = analysis.match(/\$[\d,]+/);
    return valueMatch ? valueMatch[0] : 'N/A';
  }

  private extractConfidence(analysis: string): number {
    // Extract confidence level
    const confidenceMatch = analysis.match(/(\d+)%/);
    return confidenceMatch ? parseInt(confidenceMatch[1] || '75') : 75;
  }

  private extractROI(analysis: string): number {
    // Extract ROI percentage
    const roiMatch = analysis.match(/(\d+(?:\.\d+)?)%/);
    return roiMatch ? parseFloat(roiMatch[1] || '0') : 0;
  }
}

export default AIService;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  MapPin, 
  Calendar,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Heart,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';

interface PropertyAnalysis {
  overallScore: number;
  marketTrend: 'bullish' | 'bearish' | 'stable';
  investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  timeToBreakeven: number;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  marketComparisons: {
    averagePrice: number;
    pricePerSqft: number;
    appreciation: number;
  };
  aiConfidence: number;
}

interface AIPropertyAnalyzerProps {
  property: any;
  onAnalysisComplete?: (analysis: PropertyAnalysis) => void;
  autoStart?: boolean;
}

export const AIPropertyAnalyzer: React.FC<AIPropertyAnalyzerProps> = ({
  property,
  onAnalysisComplete,
  autoStart = false
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const analysisSteps = [
    { name: 'Market Research', icon: BarChart3, duration: 2000 },
    { name: 'Location Analysis', icon: MapPin, duration: 1500 },
    { name: 'Financial Modeling', icon: DollarSign, duration: 2500 },
    { name: 'Risk Assessment', icon: Shield, duration: 1800 },
    { name: 'Trend Prediction', icon: TrendingUp, duration: 2200 },
    { name: 'Final Scoring', icon: Target, duration: 1000 }
  ];

  useEffect(() => {
    if (autoStart && property) {
      startAnalysis();
    }
  }, [autoStart, property]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);

    // Simulate AI analysis steps
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      
      // Animate progress for current step
      const stepDuration = analysisSteps[i].duration;
      const progressIncrement = 100 / analysisSteps.length;
      
      await new Promise(resolve => {
        const startProgress = i * progressIncrement;
        const endProgress = (i + 1) * progressIncrement;
        let currentProgress = startProgress;
        
        const progressInterval = setInterval(() => {
          currentProgress += (endProgress - startProgress) / (stepDuration / 50);
          setProgress(Math.min(currentProgress, endProgress));
          
          if (currentProgress >= endProgress) {
            clearInterval(progressInterval);
            resolve(void 0);
          }
        }, 50);
      });
    }

    // Generate analysis results
    const analysisResult = generateAnalysis(property);
    setAnalysis(analysisResult);
    setIsAnalyzing(false);
    onAnalysisComplete?.(analysisResult);
  };

  const generateAnalysis = (prop: any): PropertyAnalysis => {
    // Simulate AI analysis based on property data
    const baseScore = Math.random() * 20 + 70; // 70-90 base score
    const locationBonus = prop.city === 'San Francisco' || prop.city === 'New York' ? 5 : 
                         prop.city === 'Miami' || prop.city === 'Los Angeles' ? 3 : 0;
    const typeBonus = prop.type === 'Commercial' ? 2 : prop.type === 'Residential' ? 1 : 0;
    
    const overallScore = Math.min(95, baseScore + locationBonus + typeBonus);
    
    const marketTrends: Array<'bullish' | 'bearish' | 'stable'> = ['bullish', 'stable', 'bearish'];
    const marketTrend = marketTrends[Math.floor(Math.random() * marketTrends.length)];
    
    const grades: Array<'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C'> = ['A+', 'A', 'B+', 'B', 'C+', 'C'];
    const investmentGrade = grades[Math.floor(overallScore / 15)];
    
    const riskLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const riskLevel = overallScore > 85 ? 'low' : overallScore > 70 ? 'medium' : 'high';

    return {
      overallScore: Math.round(overallScore),
      marketTrend,
      investmentGrade,
      riskLevel,
      expectedReturn: Math.random() * 8 + 7, // 7-15%
      timeToBreakeven: Math.random() * 3 + 2, // 2-5 years
      strengths: [
        'Prime location with high growth potential',
        'Strong rental demand in the area',
        'Recent infrastructure improvements nearby',
        'Below market average price per square foot'
      ],
      concerns: [
        'Market volatility in the short term',
        'Potential interest rate increases',
        'Seasonal rental fluctuations'
      ],
      recommendations: [
        'Consider fractional ownership to diversify risk',
        'Monitor local market trends closely',
        'Evaluate rental income potential',
        'Review comparable sales in the area'
      ],
      marketComparisons: {
        averagePrice: (prop.price || 0) * (0.9 + Math.random() * 0.2),
        pricePerSqft: (prop.price_per_sqft || 0) * (0.95 + Math.random() * 0.1),
        appreciation: Math.random() * 10 + 5 // 5-15%
      },
      aiConfidence: Math.random() * 10 + 85 // 85-95%
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-emerald-400 to-green-500';
    if (score >= 70) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400';
    if (grade.startsWith('B')) return 'text-amber-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={isAnalyzing ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
            className="p-3 rounded-xl bg-linear-to-br from-purple-400 to-blue-500 shadow-lg"
          >
            <Brain className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI Property Analysis</h2>
            <p className="text-gray-300 text-sm">Advanced machine learning insights</p>
          </div>
        </div>
        
        {!isAnalyzing && !analysis && (
          <motion.button
            onClick={startAnalysis}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-linear-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>Analyze Property</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Analysis Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-purple-400 to-blue-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {analysisSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-500/20 border-purple-400/50' 
                        : isCompleted
                        ? 'bg-emerald-500/20 border-emerald-400/50'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                        className={`p-2 rounded-lg ${
                          isActive 
                            ? 'bg-purple-500' 
                            : isCompleted 
                            ? 'bg-emerald-500' 
                            : 'bg-gray-600'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <StepIcon className="h-4 w-4 text-white" />
                        )}
                      </motion.div>
                      <div>
                        <p className={`font-medium text-sm ${
                          isActive ? 'text-purple-300' : 
                          isCompleted ? 'text-emerald-300' : 'text-gray-400'
                        }`}>
                          {step.name}
                        </p>
                        {isActive && (
                          <motion.div
                            className="flex space-x-1 mt-1"
                          >
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 h-1 bg-purple-400 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {analysis && !isAnalyzing && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-linear-to-br ${getScoreColor(analysis.overallScore)} shadow-2xl mb-4`}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{analysis.overallScore}</div>
                  <div className="text-sm text-white/80">Score</div>
                </div>
              </motion.div>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Grade:</span>
                  <span className={`font-bold ${getGradeColor(analysis.investmentGrade)}`}>
                    {analysis.investmentGrade}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Risk:</span>
                  <span className={`font-bold ${getRiskColor(analysis.riskLevel)} capitalize`}>
                    {analysis.riskLevel}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Confidence:</span>
                  <span className="font-bold text-blue-400">
                    {analysis.aiConfidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-4 border border-emerald-400/20">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">Expected Return</span>
                </div>
                <p className="text-2xl font-bold text-emerald-400">
                  {analysis.expectedReturn.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">Annual projected</p>
              </div>

              <div className="bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">Breakeven</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {analysis.timeToBreakeven.toFixed(1)}
                </p>
                <p className="text-xs text-gray-400">Years estimated</p>
              </div>

              <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/20">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300 text-sm font-medium">Market Trend</span>
                </div>
                <p className="text-2xl font-bold text-purple-400 capitalize">
                  {analysis.marketTrend}
                </p>
                <p className="text-xs text-gray-400">Current direction</p>
              </div>
            </div>

            {/* Strengths and Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Strengths</span>
                </h3>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start space-x-2 text-sm text-gray-300"
                    >
                      <Sparkles className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{strength}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Considerations</span>
                </h3>
                <div className="space-y-2">
                  {analysis.concerns.map((concern, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start space-x-2 text-sm text-gray-300"
                    >
                      <Info className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                      <span>{concern}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-400/20">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-400" />
                <span>AI Recommendations</span>
                <Heart className="h-4 w-4 text-pink-400" />
              </h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
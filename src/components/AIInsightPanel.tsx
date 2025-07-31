import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb,
  Target,
  Zap,
  Heart,
  Sparkles,
  BarChart3,
  DollarSign,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'market' | 'investment' | 'risk' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  icon: any;
  color: string;
  actionable: boolean;
  data?: any;
}

interface AIInsightPanelProps {
  property?: any;
  userPortfolio?: any[];
  marketData?: any;
  className?: string;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
  property,
  userPortfolio = [],
  marketData,
  className = ""
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    generateInsights();
  }, [property, userPortfolio, marketData, refreshKey]);

  const generateInsights = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsights: AIInsight[] = [];

    // Market insights
    newInsights.push({
      id: 'market-trend-1',
      type: 'market',
      title: 'Strong Market Momentum',
      description: 'Local real estate market showing 15% growth over the past 6 months with increasing demand.',
      confidence: 87,
      impact: 'high',
      timeframe: 'short-term',
      icon: TrendingUp,
      color: 'from-emerald-400 to-green-500',
      actionable: true,
      data: { growth: 15, timeframe: '6 months' }
    });

    // Investment opportunity
    newInsights.push({
      id: 'investment-1',
      type: 'investment',
      title: 'Undervalued Property Alert',
      description: 'This property is priced 12% below market average for similar properties in the area.',
      confidence: 92,
      impact: 'high',
      timeframe: 'immediate',
      icon: Target,
      color: 'from-blue-400 to-purple-500',
      actionable: true,
      data: { discount: 12, comparison: 'market average' }
    });

    // Risk assessment
    newInsights.push({
      id: 'risk-1',
      type: 'risk',
      title: 'Interest Rate Sensitivity',
      description: 'Property value may be affected by potential interest rate changes in the next quarter.',
      confidence: 74,
      impact: 'medium',
      timeframe: 'short-term',
      icon: AlertCircle,
      color: 'from-amber-400 to-orange-500',
      actionable: true,
      data: { sensitivity: 'medium', timeframe: 'next quarter' }
    });

    // Opportunity insight
    newInsights.push({
      id: 'opportunity-1',
      type: 'opportunity',
      title: 'Rental Income Potential',
      description: 'High rental demand in this area could generate 8-12% annual returns through rental income.',
      confidence: 89,
      impact: 'high',
      timeframe: 'long-term',
      icon: DollarSign,
      color: 'from-purple-400 to-pink-500',
      actionable: true,
      data: { returnRange: [8, 12], source: 'rental income' }
    });

    // Prediction
    newInsights.push({
      id: 'prediction-1',
      type: 'prediction',
      title: 'Price Appreciation Forecast',
      description: 'AI models predict 18-25% property value increase over the next 3 years based on development plans.',
      confidence: 81,
      impact: 'high',
      timeframe: 'long-term',
      icon: BarChart3,
      color: 'from-indigo-400 to-blue-500',
      actionable: false,
      data: { appreciation: [18, 25], timeframe: '3 years' }
    });

    setInsights(newInsights);
    setIsGenerating(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return Clock;
      case 'short-term': return Calendar;
      case 'long-term': return TrendingUp;
      default: return Clock;
    }
  };

  const refreshInsights = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={isGenerating ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
            className="p-3 rounded-xl bg-linear-to-br from-purple-400 to-blue-500 shadow-lg"
          >
            <Brain className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <span>AI Market Insights</span>
              <Sparkles className="h-5 w-5 text-amber-400" />
            </h2>
            <p className="text-gray-300 text-sm">Real-time intelligence powered by machine learning</p>
          </div>
        </div>
        
        <motion.button
          onClick={refreshInsights}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isGenerating}
          className="bg-linear-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          <span>Refresh</span>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-white font-medium">AI is analyzing market data...</p>
              <p className="text-gray-400 text-sm">Processing thousands of data points</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="insights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              const TimeframeIcon = getTimeframeIcon(insight.timeframe);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedInsight(insight)}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-linear-to-br ${insight.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                          {insight.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-amber-400" />
                            <span className="text-xs text-amber-400 font-medium">
                              {insight.confidence}%
                            </span>
                          </div>
                          {insight.actionable && (
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                        {insight.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-400">Impact:</span>
                            <span className={`font-medium ${getImpactColor(insight.impact)} capitalize`}>
                              {insight.impact}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TimeframeIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-400 capitalize">
                              {insight.timeframe.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        {insight.actionable && (
                          <div className="flex items-center space-x-1 text-xs text-emerald-400">
                            <Lightbulb className="h-3 w-3" />
                            <span>Actionable</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Insight Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-linear-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-4 rounded-xl bg-linear-to-br ${selectedInsight.color} shadow-lg`}>
                  <selectedInsight.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedInsight.title}</h2>
                  <p className="text-gray-300">Detailed AI Analysis</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-3">Analysis Details</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedInsight.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{selectedInsight.confidence}%</div>
                    <div className="text-xs text-gray-400">AI Confidence</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold ${getImpactColor(selectedInsight.impact)} capitalize`}>
                      {selectedInsight.impact}
                    </div>
                    <div className="text-xs text-gray-400">Impact Level</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 capitalize">
                      {selectedInsight.timeframe.replace('-', ' ')}
                    </div>
                    <div className="text-xs text-gray-400">Timeframe</div>
                  </div>
                </div>

                {selectedInsight.actionable && (
                  <div className="bg-linear-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-400/20">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">Recommended Actions</span>
                    </div>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start space-x-2">
                        <Heart className="h-3 w-3 text-pink-400 mt-1 shrink-0" />
                        <span>Monitor this insight closely for optimal timing</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Heart className="h-3 w-3 text-pink-400 mt-1 shrink-0" />
                        <span>Consider adjusting your investment strategy accordingly</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Heart className="h-3 w-3 text-pink-400 mt-1 shrink-0" />
                        <span>Consult with our AI advisor for personalized guidance</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <motion.button
                  onClick={() => setSelectedInsight(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-linear-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
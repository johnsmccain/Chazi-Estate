import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AIHederaAgent } from '../components/AIHederaAgent';
import { Bot, Sparkles, Shield, Zap, TrendingUp, Brain } from 'lucide-react';

export const AIAgentPage: React.FC = () => {
  const [agentStats, setAgentStats] = useState({
    totalAnalyses: 0,
    successfulTrades: 0,
    portfolioValue: 0,
    aiConfidence: 0
  });

  useEffect(() => {
    // Simulate loading agent statistics
    setAgentStats({
      totalAnalyses: 1247,
      successfulTrades: 89,
      portfolioValue: 125000,
      aiConfidence: 94
    });
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI Property Analysis',
      description: 'Advanced machine learning algorithms analyze property data, market trends, and investment potential.',
      color: 'from-purple-400 to-blue-500'
    },
    {
      icon: Shield,
      title: 'Hedera Blockchain Security',
      description: 'All transactions are secured by Hedera\'s enterprise-grade blockchain technology.',
      color: 'from-emerald-400 to-blue-500'
    },
    {
      icon: Zap,
      title: 'Smart Contract Execution',
      description: 'Automated investment execution through verified smart contracts on Hedera testnet.',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Market Monitoring',
      description: 'Continuous market analysis and trend prediction for optimal investment timing.',
      color: 'from-pink-400 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-2xl"
            >
              <Bot className="h-12 w-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                AI Hedera Agent
              </h1>
              <div className="flex items-center justify-center space-x-2 text-purple-300">
                <Sparkles className="h-5 w-5" />
                <span className="text-lg">Intelligent Blockchain Investment Assistant</span>
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of real estate investment with our AI-powered agent that combines 
            advanced machine learning with Hedera blockchain technology for intelligent, secure, 
            and automated property investments.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {agentStats.totalAnalyses.toLocaleString()}
            </div>
            <div className="text-gray-300 text-sm">Properties Analyzed</div>
          </div>
          
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {agentStats.successfulTrades}%
            </div>
            <div className="text-gray-300 text-sm">Success Rate</div>
          </div>
          
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              ${agentStats.portfolioValue.toLocaleString()}
            </div>
            <div className="text-gray-300 text-sm">Portfolio Value</div>
          </div>
          
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">
              {agentStats.aiConfidence}%
            </div>
            <div className="text-gray-300 text-sm">AI Confidence</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Agent Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <AIHederaAgent 
              userAddress="0x1234...5678"
              currentProperty={{
                name: "Luxury Downtown Condo",
                price: 500000,
                location: "Miami, FL"
              }}
            />
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span>Key Features</span>
            </h3>
            
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-linear-to-br ${feature.color} shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-2xl p-6"
            >
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span>Quick Actions</span>
              </h4>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-gray-300 hover:text-white">
                  🏠 Analyze New Property
                </button>
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-gray-300 hover:text-white">
                  📊 Portfolio Overview
                </button>
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-gray-300 hover:text-white">
                  📈 Market Trends
                </button>
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-gray-300 hover:text-white">
                  🔧 Contract Status
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-linear-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-white font-semibold">Powered by Hedera Testnet</span>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              All AI recommendations and blockchain transactions are executed on Hedera's secure, 
              enterprise-grade distributed ledger technology. Your investments are protected by 
              cryptographic security and smart contract automation.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAlgorand } from '../hooks/useAlgorand';
import { PropertyCard } from '../components/PropertyCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AIVoiceAgent } from '../components/AIVoiceAgent';
import { AIInsightPanel } from '../components/AIInsightPanel';
import { 
  Plus, 
  Building, 
  FileText, 
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Wallet,
  Sparkles,
  Heart,
  ArrowUpRight,
  Brain,
  Zap,
  Target,
  Users,
  DollarSign
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isConnected, account, balance, properties, connectWallet, isLoading } = useAlgorand();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Mock data - in a real app, this would come from an API
  const stats = [
    { 
      label: 'Properties Owned', 
      value: '3', 
      icon: Building, 
      color: 'from-emerald-400 to-blue-500',
      change: '+1 this month',
      trend: 'up'
    },
    { 
      label: 'Active Deeds', 
      value: '2', 
      icon: FileText, 
      color: 'from-blue-400 to-purple-500',
      change: 'All verified',
      trend: 'stable'
    },
    { 
      label: 'AI Insights', 
      value: '5', 
      icon: Brain, 
      color: 'from-purple-400 to-pink-500',
      change: '2 new today',
      trend: 'up'
    },
    { 
      label: 'Total Value', 
      value: '$1.2M', 
      icon: TrendingUp, 
      color: 'from-amber-400 to-orange-500',
      change: '+12% this year',
      trend: 'up'
    },
  ];

  const mockProperties = [
    {
      id: '1',
      address: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      type: 'Residential',
      value: '$850,000',
      status: 'verified' as const,
      recordedDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      sqft: '2,000',
      bedrooms: 3,
      bathrooms: 2
    },
    {
      id: '2',
      address: '456 Pine Avenue',
      city: 'Los Angeles',
      state: 'CA',
      type: 'Commercial',
      value: '$420,000',
      status: 'pending' as const,
      recordedDate: '2024-01-10',
      image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      sqft: '5,000'
    }
  ];

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const aiWelcomeMessage = `Welcome back, ${user?.name?.split(' ')[0]}! I've been analyzing your portfolio and the market while you were away. I found some exciting opportunities and have 5 new insights ready for you. Your properties are performing excellently, with a 12% increase in total value this year. Would you like me to walk you through the latest market trends or help you explore new investment opportunities?`;

  return (
    <div className="space-y-8">
      {/* Welcome Section with AI Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="bg-linear-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-2 flex items-center space-x-3"
              >
                <span>Welcome back, {user?.name?.split(' ')[0]}!</span>
                <Heart className="h-8 w-8 text-pink-400" />
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg"
              >
                Your AI-powered real estate empire is thriving. Let's make some magic happen today! ✨
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-linear-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Brain className="h-5 w-5" />
                <span>{showAIAssistant ? 'Hide' : 'Show'} AI Assistant</span>
              </motion.button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="hidden md:block"
              >
                <div className="w-24 h-24 bg-linear-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* AI Assistant */}
          <AnimatePresence>
            {showAIAssistant && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <AIVoiceAgent
                  message={aiWelcomeMessage}
                  isActive={true}
                  agentName="Your Personal DeedAI Assistant"
                  personality="caring"
                  capabilities={['Market Analysis', 'Portfolio Optimization', 'Risk Assessment']}
                  showVisualizer={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Wallet Connection */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-linear-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Connect Your Algorand Wallet</h3>
                <p className="text-gray-300">Unlock blockchain features and secure your property deeds</p>
              </div>
            </div>
            <motion.button
              onClick={handleConnectWallet}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-linear-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Connect Wallet'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-emerald-400 text-xs font-medium">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <AIInsightPanel 
          userPortfolio={mockProperties}
          className="mb-8"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-amber-400" />
          <span>AI-Powered Quick Actions</span>
          <Sparkles className="h-5 w-5 text-amber-400" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/upload"
              className="flex items-center space-x-4 p-6 bg-linear-to-r from-emerald-500 to-blue-600 rounded-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg">Add Property</span>
                <p className="text-emerald-100 text-sm">AI-guided deed creation</p>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/browse"
              className="flex items-center space-x-4 p-6 bg-linear-to-r from-purple-500 to-pink-600 rounded-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg">Smart Browse</span>
                <p className="text-purple-100 text-sm">AI-recommended properties</p>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className="flex items-center space-x-4 p-6 bg-linear-to-r from-amber-500 to-orange-600 rounded-xl hover:shadow-2xl transition-all duration-300 group w-full">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg">AI Advisor</span>
                <p className="text-amber-100 text-sm">Get personalized insights</p>
              </div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Properties List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-400" />
            <span>Your Properties</span>
            <Heart className="h-5 w-5 text-pink-400" />
          </h2>
          <Link
            to="/my-properties"
            className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {mockProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <PropertyCard
                  property={property}
                  onClick={() => setSelectedProperty(property.id)}
                  variant="compact"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {mockProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No properties yet</h3>
            <p className="text-gray-300 mb-6">
              Ready to add your first property? Let's get started with AI assistance!
            </p>
            <Link
              to="/upload"
              className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
            >
              <Brain className="h-5 w-5" />
              <span>Add Your First Property</span>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Algorand Integration Status */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-linear-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-lg border border-emerald-400/30 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Blockchain Connected</h2>
            <Shield className="h-5 w-5 text-blue-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-purple-400" />
                <span>Wallet Address</span>
              </h3>
              <p className="text-gray-300 text-sm font-mono break-all">
                {account?.slice(0, 8)}...{account?.slice(-8)}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span>Balance</span>
              </h3>
              <p className="text-emerald-400 font-semibold">
                {(balance / 1000000).toFixed(2)} ALGO
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
                <Building className="h-4 w-4 text-blue-400" />
                <span>Properties</span>
              </h3>
              <p className="text-blue-400 font-semibold">
                {properties.length} NFTs
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
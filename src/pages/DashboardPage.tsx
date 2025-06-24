import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAlgorand } from '../hooks/useAlgorand';
import { 
  Building, 
  FileText, 
  TrendingUp,
  DollarSign,
  Brain,
  Sparkles,
  Heart
} from 'lucide-react';

// Import new components
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { QuickActions } from '../components/dashboard/QuickActions';
import { WalletConnection } from '../components/dashboard/WalletConnection';
import { PropertiesList } from '../components/dashboard/PropertiesList';
import { AIInsightPanel } from '../components/AIInsightPanel';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isConnected, account, balance, properties, connectWallet, isLoading } = useAlgorand();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Mock data - in a real app, this would come from an API
  const stats = [
    { 
      label: 'Properties Owned', 
      value: '3', 
      icon: Building, 
      color: 'from-emerald-400 to-blue-500',
      change: '+1 this month',
      trend: 'up' as const
    },
    { 
      label: 'Active Deeds', 
      value: '2', 
      icon: FileText, 
      color: 'from-blue-400 to-purple-500',
      change: 'All verified',
      trend: 'stable' as const
    },
    { 
      label: 'AI Insights', 
      value: '5', 
      icon: Brain, 
      color: 'from-purple-400 to-pink-500',
      change: '2 new today',
      trend: 'up' as const
    },
    { 
      label: 'Total Value', 
      value: '$1.2M', 
      icon: TrendingUp, 
      color: 'from-amber-400 to-orange-500',
      change: '+12% this year',
      trend: 'up' as const
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

  const handlePropertyClick = async (property: any) => {
    setSelectedProperty(property.id);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center space-x-3"
              >
                <span>Welcome back, {user?.name?.split(' ')[0]}!</span>
                <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-pink-400" />
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-base lg:text-lg"
              >
                Your AI-powered real estate empire is thriving. Let's make some magic happen today! ✨
              </p>
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
              </div>
            </motion.div>
          </div>

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
      <WalletConnection
        isConnected={isConnected}
        account={account}
        balance={balance}
        properties={properties}
        isLoading={isLoading}
        onConnect={connectWallet}
      />

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

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
      <QuickActions />

      {/* Properties List */}
      <PropertiesList
        properties={mockProperties}
        onPropertyClick={handlePropertyClick}
      />
    </div>
  );
};
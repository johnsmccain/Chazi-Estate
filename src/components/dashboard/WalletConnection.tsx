import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle, DollarSign, Building, Shield, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';

interface WalletConnectionProps {
  isConnected: boolean;
  account: string | null;
  balance: number;
  properties: any[];
  isLoading: boolean;
  onConnect: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  isConnected,
  account,
  balance,
  properties,
  isLoading,
  onConnect
}) => {
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Connect Your Algorand Wallet</h3>
              <p className="text-gray-300">Unlock blockchain features and secure your property deeds</p>
            </div>
          </div>
          <motion.button
            onClick={onConnect}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Connect Wallet'}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
      className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-lg border border-emerald-400/30 rounded-2xl p-6 shadow-xl"
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
  );
};
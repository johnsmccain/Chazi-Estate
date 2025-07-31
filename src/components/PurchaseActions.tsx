import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Zap,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface PurchaseActionsProps {
  calculatedShares: number;
  isAuthenticated: boolean;
  isPurchasing: boolean;
  onPurchase: () => void;
  totalInvestment: number;
  formatCurrency: (amount: number) => string;
}

export const PurchaseActions: React.FC<PurchaseActionsProps> = ({
  calculatedShares,
  isAuthenticated,
  isPurchasing,
  onPurchase,
  totalInvestment,
  formatCurrency
}) => {
  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <div className="bg-linear-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-4 border border-emerald-400/20">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-emerald-400" />
          <span className="text-emerald-300 font-medium">Blockchain Security</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          Your investment is secured by smart contracts on the Algorand blockchain. 
          All transactions are immutable and transparent.
        </p>
      </div>

      {/* Investment Info */}
      {calculatedShares > 0 && (
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/20">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 font-medium">Investment Details</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Shares:</span>
              <span className="text-white font-semibold">{calculatedShares}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span className="text-emerald-400 font-semibold">{formatCurrency(totalInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Fee:</span>
              <span className="text-gray-400">$0 (No fees!)</span>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Button */}
      <motion.button
        onClick={onPurchase}
        disabled={!calculatedShares || calculatedShares === 0 || isPurchasing || !isAuthenticated}
        whileHover={{ scale: calculatedShares > 0 && !isPurchasing ? 1.02 : 1 }}
        whileTap={{ scale: calculatedShares > 0 && !isPurchasing ? 0.98 : 1 }}
        className="w-full bg-linear-to-r from-emerald-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
      >
        {isPurchasing ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Processing Purchase...</span>
          </>
        ) : calculatedShares > 0 ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Purchase {calculatedShares} Shares</span>
            <Heart className="h-4 w-4" />
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5" />
            <span>Enter Investment Amount</span>
          </>
        )}
      </motion.button>

      {!isAuthenticated && (
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Please log in to purchase property shares
          </p>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-center text-xs text-gray-400 space-y-1">
        <p>🔒 Secured by blockchain technology</p>
        <p>💎 Fractional ownership made simple</p>
        <p>🚀 Instant settlement & verification</p>
      </div>
    </div>
  );
};
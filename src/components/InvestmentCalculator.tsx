import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  TrendingUp,
  PieChart,
  Percent
} from 'lucide-react';
import { Property, formatCurrency } from '../lib/supabase';

interface InvestmentCalculatorProps {
  property: Property;
  investmentAmount: number;
  onInvestmentChange: (amount: number) => void;
  calculatedShares: number;
  ownershipPercentage: number;
  projectedReturn: number;
  totalInvestment: number;
}

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  property,
  investmentAmount,
  onInvestmentChange,
  calculatedShares,
  ownershipPercentage,
  projectedReturn,
  totalInvestment
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Investment Calculator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Investment Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={investmentAmount || ''}
              onChange={(e) => onInvestmentChange(Number(e.target.value))}
              min={property.min_investment || property.share_price}
              max={(property.available_shares || 0) * (property.share_price || 0)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              placeholder={`Min: ${formatCurrency(property.min_investment || property.share_price || 0)}`}
            />
          </div>
          {property.min_investment && investmentAmount < property.min_investment && (
            <p className="text-red-400 text-sm mt-1">
              Minimum investment: {formatCurrency(property.min_investment)}
            </p>
          )}
        </div>

        {calculatedShares > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300">Shares to Purchase</span>
                  </div>
                  <span className="font-semibold text-blue-400 text-lg">{calculatedShares}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-emerald-400" />
                    <span className="text-gray-300">Ownership Percentage</span>
                  </div>
                  <span className="font-semibold text-emerald-400 text-lg">{ownershipPercentage.toFixed(2)}%</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">Projected Annual Return</span>
                  </div>
                  <span className="font-semibold text-purple-400 text-lg">{formatCurrency(projectedReturn)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-amber-400" />
                    <span className="text-gray-300">Total Investment</span>
                  </div>
                  <span className="font-semibold text-amber-400 text-lg">{formatCurrency(totalInvestment)}</span>
                </div>
              </div>
            </div>

            {property.expected_return && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-4 border border-emerald-400/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Percent className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Investment Summary</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Expected Annual Return:</span>
                    <span className="text-emerald-400 font-semibold">{property.expected_return}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Estimated Income:</span>
                    <span className="text-blue-400 font-semibold">{formatCurrency(projectedReturn / 12)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
import React from 'react';
import { DollarSign, Home } from 'lucide-react';
import { formatCurrency } from '../../lib/supabase';

interface PropertyStatsProps {
  price: number;
  pricePerSqft?: number;
  sqft: number;
  bedrooms?: number;
  bathrooms?: number;
}

export const PropertyStats: React.FC<PropertyStatsProps> = ({
  price,
  pricePerSqft,
  sqft,
  bedrooms,
  bathrooms
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
      <div className="bg-white/5 rounded-lg p-2 sm:p-3">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
          <span className="text-gray-300 text-xs">Total Value</span>
        </div>
        <p className="text-white font-semibold text-sm sm:text-base">{formatCurrency(price)}</p>
        {pricePerSqft && (
          <p className="text-gray-400 text-xs">{formatCurrency(pricePerSqft)}/sq ft</p>
        )}
      </div>
      
      <div className="bg-white/5 rounded-lg p-2 sm:p-3">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
          <Home className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          <span className="text-gray-300 text-xs">Size</span>
        </div>
        <p className="text-white font-semibold text-sm sm:text-base">{sqft.toLocaleString()} sq ft</p>
        {bedrooms && bathrooms && (
          <p className="text-gray-400 text-xs">{bedrooms}bd/{bathrooms}ba</p>
        )}
      </div>
    </div>
  );
};
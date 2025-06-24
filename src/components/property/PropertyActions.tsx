import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Key, CreditCard, Eye } from 'lucide-react';
import { Property } from '../../lib/supabase';

interface PropertyActionsProps {
  property: Property;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({ property }) => {
  const hasActions = property.fraction_available || property.rent_available || property.loan_available;

  if (!hasActions) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="col-span-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
      >
        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>View Details</span>
      </motion.button>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
      {property.fraction_available && property.available_shares && property.available_shares > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <PieChart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span>Buy</span>
        </motion.button>
      )}
      {property.rent_available && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <Key className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span>Rent</span>
        </motion.button>
      )}
      {property.loan_available && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <CreditCard className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span>Loan</span>
        </motion.button>
      )}
    </div>
  );
};
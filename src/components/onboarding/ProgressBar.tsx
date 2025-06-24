import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="max-w-md mx-auto mb-4 lg:mb-6">
      <div className="flex justify-between text-xs lg:text-sm text-gray-300 mb-2">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 lg:h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
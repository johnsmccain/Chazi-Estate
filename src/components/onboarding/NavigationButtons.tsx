import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  actionText: string;
  onNext: () => void;
  onSkip: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  actionText,
  onNext,
  onSkip
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 px-4"
    >
      <button
        onClick={onSkip}
        className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group text-sm lg:text-base"
      >
        <span>Skip onboarding</span>
        <motion.div
          whileHover={{ x: 5 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </button>

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold flex items-center space-x-2 lg:space-x-3 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 text-sm lg:text-base"
      >
        <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
        <span>{actionText}</span>
        <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
      </motion.button>
    </motion.div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'blockchain' | 'ai';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'blockchain':
        return {
          colors: 'from-emerald-400 to-blue-500',
          message: message || 'Processing on blockchain...',
          icon: Building2
        };
      case 'ai':
        return {
          colors: 'from-purple-400 to-pink-500',
          message: message || 'AI is thinking...',
          icon: Building2
        };
      default:
        return {
          colors: 'from-blue-400 to-emerald-500',
          message: message,
          icon: Building2
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-white/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-blue-500`} />
        </motion.div>

        {/* Inner Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <IconComponent className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
        </motion.div>

        {/* Pulsing Background */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-linear-to-r ${config.colors} opacity-20`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Loading Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-white font-medium mb-1">{config.message}</p>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-emerald-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Progress Indicator for Blockchain */}
      {variant === 'blockchain' && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="w-48 h-1 bg-white/20 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-linear-to-r from-emerald-400 to-blue-500 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
};
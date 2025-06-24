import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  gradient = true
}) => {
  const baseClasses = `
    ${gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/10'}
    backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl
    ${hover ? 'hover:shadow-2xl hover:border-emerald-400/30 transition-all duration-300' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  if (hover || onClick) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className={`${baseClasses} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};
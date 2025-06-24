import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:shadow-xl focus:ring-emerald-400/20',
    secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20 focus:ring-white/20',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/10 focus:ring-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-xl focus:ring-red-400/20'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm space-x-1',
    md: 'px-4 py-3 text-base space-x-2',
    lg: 'px-6 py-4 text-lg space-x-3'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading && (
        <div className={`animate-spin rounded-full border-2 border-white/30 border-t-white ${iconSizes[size]} mr-2`} />
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={iconSizes[size]} />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={iconSizes[size]} />
      )}
    </motion.button>
  );
};
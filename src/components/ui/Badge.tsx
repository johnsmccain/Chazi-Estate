import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = ''
}) => {
  const variants = {
    success: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30',
    warning: 'text-amber-400 bg-amber-400/20 border-amber-400/30',
    error: 'text-red-400 bg-red-400/20 border-red-400/30',
    info: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
    neutral: 'text-gray-400 bg-gray-400/20 border-gray-400/30'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-full font-medium border backdrop-blur-sm
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {Icon && <Icon className={iconSizes[size]} />}
      <span>{children}</span>
    </div>
  );
};
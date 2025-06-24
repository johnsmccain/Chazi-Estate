import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';

interface PropertyImageProps {
  src: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
}

export const PropertyImage: React.FC<PropertyImageProps> = ({
  src,
  alt,
  children,
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        whileHover={{ scale: 1.1 }}
      />
      
      {children}

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4"
      >
        <div className="flex items-center space-x-2 text-white">
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium">View Details</span>
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </motion.div>
    </div>
  );
};
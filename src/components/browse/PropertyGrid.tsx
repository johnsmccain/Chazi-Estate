import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';
import { PropertyCard } from '../PropertyCard';

interface PropertyGridProps {
  properties: any[];
  viewMode: 'grid' | 'list';
  sortBy: string;
  userShares: Record<string, number>;
  onPropertyClick: (property: any) => void;
  onAnalyzeProperty: (property: any) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  viewMode,
  sortBy,
  userShares,
  onPropertyClick,
  onAnalyzeProperty
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className={`grid gap-8 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}
    >
      <AnimatePresence>
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            <PropertyCard
              property={property}
              onClick={() => onPropertyClick(property)}
              showOwner={true}
              variant={viewMode === 'list' ? 'detailed' : 'default'}
              userShares={userShares[property.id] || 0}
            />
            
            {/* AI Score Badge */}
            {sortBy === 'ai-recommended' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10"
              >
                <div className="flex items-center space-x-1">
                  <Brain className="h-3 w-3" />
                  <span>AI Pick</span>
                </div>
              </motion.div>
            )}
            
            {/* Quick Analysis Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onAnalyzeProperty(property);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            >
              <Zap className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
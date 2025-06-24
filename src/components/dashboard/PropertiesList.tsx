import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Heart, ArrowUpRight, Brain } from 'lucide-react';
import { PropertyCard } from '../PropertyCard';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  type: string;
  value: string;
  status: 'verified' | 'pending' | 'unverified';
  recordedDate: string;
  image: string;
  sqft: string;
  bedrooms?: number;
  bathrooms?: number;
}

interface PropertiesListProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

export const PropertiesList: React.FC<PropertiesListProps> = ({
  properties,
  onPropertyClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">
          <Building className="h-6 w-6 text-blue-400" />
          <span>Your Properties</span>
          <Heart className="h-5 w-5 text-pink-400" />
        </h2>
        <Link
          to="/my-properties"
          className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <PropertyCard
                property={property}
                onClick={() => onPropertyClick(property)}
                variant="compact"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {properties.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No properties yet</h3>
          <p className="text-gray-300 mb-6">
            Ready to add your first property? Let's get started with AI assistance!
          </p>
          <Link
            to="/upload"
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
          >
            <Brain className="h-5 w-5" />
            <span>Add Your First Property</span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
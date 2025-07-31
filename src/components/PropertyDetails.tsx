import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Home, 
  Calendar,
  Star,
  Eye,
  Users,
  TrendingUp
} from 'lucide-react';
import { Property, formatCurrency } from '../lib/supabase';

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building className="h-6 w-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Property Details</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400 text-sm">{property.views} views</span>
        </div>
      </div>

      <img
        src={property.image_url}
        alt={property.title}
        className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
      />

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-300 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {formatCurrency(property.price)}
            </div>
            <div className="text-sm text-gray-400">Total Value</div>
            {property.price_per_sqft && (
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(property.price_per_sqft)}/sq ft
              </div>
            )}
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {property.sqft.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Square Feet</div>
            {property.bedrooms && property.bathrooms && (
              <div className="text-xs text-gray-500 mt-1">
                {property.bedrooms}bd / {property.bathrooms}ba
              </div>
            )}
          </div>
        </div>

        {property.ownership_type === 'Fractional' && (
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 font-medium">Fractional Ownership</span>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Available Shares:</span>
                <p className="text-white font-semibold">{property.available_shares} / {property.total_shares}</p>
              </div>
              <div>
                <span className="text-gray-400">Share Price:</span>
                <p className="text-purple-400 font-semibold">{formatCurrency(property.share_price || 0)}</p>
              </div>
            </div>
            {property.expected_return && (
              <div className="mt-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">{property.expected_return}% Expected Return</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
          </div>
          {property.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-amber-400 fill-current" />
              <span className="text-amber-400">{property.rating}</span>
            </div>
          )}
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
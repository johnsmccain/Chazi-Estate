import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Calendar, Shield, Eye, Edit } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'minted':
        return 'bg-blue-100 text-blue-800';
      case 'transferred':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: Property['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'verified':
        return 'Verified';
      case 'minted':
        return 'NFT Minted';
      case 'transferred':
        return 'Transferred';
      default:
        return status;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Property Image */}
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 relative">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={`${property.address.street}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-gray-600">Property Image</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {formatStatus(property.status)}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4 space-y-3">
        {/* Address */}
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {property.address.street}
            </p>
            <p className="text-xs text-gray-600">
              {property.address.city}, {property.address.state} {property.address.zipCode}
            </p>
          </div>
        </div>

        {/* Valuation */}
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="font-semibold text-lg text-gray-900">
            ${property.valuation.toLocaleString()}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Added {property.createdAt.toLocaleDateString()}
          </span>
        </div>

        {/* NFT Token ID */}
        {property.nftTokenId && (
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-xs text-blue-600 font-medium">
              NFT Token: {property.nftTokenId.slice(0, 10)}...
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex space-x-2">
        <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Eye className="h-4 w-4" />
          <span className="text-sm">View</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
          <Edit className="h-4 w-4" />
          <span className="text-sm">Edit</span>
        </button>
      </div>
    </motion.div>
  );
};
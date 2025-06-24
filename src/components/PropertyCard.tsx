import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar,
  Shield,
  TrendingUp,
  Vote
} from 'lucide-react';
import { Property, formatCurrency } from '../lib/supabase';
import { Card } from './ui/Card';
import { PropertyImage } from './property/PropertyImage';
import { PropertyBadges } from './property/PropertyBadges';
import { PropertyStats } from './property/PropertyStats';
import { PropertyActions } from './property/PropertyActions';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  showOwner?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  userShares?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  showOwner = false,
  variant = 'default',
  userShares = 0
}) => {
  const ownershipPercentage = property.total_shares ? (userShares / property.total_shares) * 100 : 0;

  return (
    <Card
      hover={true}
      onClick={onClick}
      className={`
        overflow-hidden group
        ${variant === 'compact' ? 'max-w-sm' : ''}
      `}
    >
      {/* Property Image */}
      <PropertyImage
        src={property.image_url}
        alt={property.title}
      >
        <PropertyBadges
          status={property.status}
          type={property.type}
          rating={property.rating}
          views={property.views}
          userShares={userShares}
          totalShares={property.total_shares}
          availableShares={property.available_shares}
        />
      </PropertyImage>

      {/* Property Details */}
      <div className="p-4 sm:p-6">
        {/* Title and Address */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-white font-semibold text-base sm:text-lg mb-1 group-hover:text-emerald-300 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-300 text-xs sm:text-sm">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>

        {/* Property Stats */}
        <PropertyStats
          price={property.price}
          pricePerSqft={property.price_per_sqft}
          sqft={property.sqft}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
        />

        {/* Fractional Ownership Details */}
        {property.ownership_type === 'Fractional' && property.total_shares && (
          <div className="bg-purple-500/10 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 border border-purple-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-xs sm:text-sm font-medium">Fractional Ownership</span>
              {property.share_price && (
                <span className="text-purple-400 font-semibold text-xs sm:text-sm">{formatCurrency(property.share_price)}/share</span>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-300 mb-2">
              <span>{property.available_shares || 0} of {property.total_shares} shares available</span>
              {property.expected_return && (
                <span className="hidden sm:inline">{property.expected_return}% expected return</span>
              )}
            </div>
            <div className="w-full bg-purple-900/30 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-1.5 sm:h-2 rounded-full"
                style={{ width: `${((property.total_shares - (property.available_shares || 0)) / property.total_shares) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Monthly Rent Collection */}
        {property.monthly_rent_collected && property.monthly_rent_collected > 0 && (
          <div className="bg-emerald-500/10 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 border border-emerald-400/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                <span className="text-emerald-300 text-xs sm:text-sm font-medium">Monthly Rent</span>
              </div>
              <span className="text-emerald-400 font-semibold text-xs sm:text-sm">{formatCurrency(property.monthly_rent_collected)}</span>
            </div>
            {property.last_rent_distribution && (
              <p className="text-gray-300 text-xs mt-1">
                Last distribution: {new Date(property.last_rent_distribution).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* DAO Governance */}
        {property.dao_enabled && userShares > 0 && (
          <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 border border-blue-400/20">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <Vote className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
              <span className="text-blue-300 text-xs sm:text-sm font-medium">DAO Governance</span>
            </div>
            <p className="text-gray-300 text-xs">
              You have {ownershipPercentage.toFixed(1)}% voting power in property decisions
            </p>
          </div>
        )}

        {/* Owner Info */}
        {showOwner && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              <span className="text-gray-300 text-xs">Owner</span>
            </div>
            <p className="text-white text-xs sm:text-sm font-medium">{property.owner_name}</p>
          </div>
        )}

        {/* Blockchain Info */}
        {property.blockchain_token_id && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-400/20">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-medium">Blockchain Secured</span>
            </div>
            <p className="text-gray-300 text-xs font-mono truncate">{property.blockchain_token_id}</p>
          </div>
        )}

        {/* Recorded Date */}
        <div className="flex items-center justify-between text-xs sm:text-sm mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-gray-300">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
            <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
          </div>
          
          {property.status === 'verified' && (
            <div className="flex items-center space-x-1 text-emerald-400">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <PropertyActions property={property} />
      </div>
    </Card>
  );
};
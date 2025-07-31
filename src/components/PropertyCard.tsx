import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Home, 
  Calendar,
  Shield,
  Eye,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Users,
  Star,
  PieChart,
  Key,
  CreditCard,
  Percent,
  TrendingUp,
  Vote
} from 'lucide-react';
import { Property, formatCurrency } from '../lib/supabase';

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
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30',
          label: 'Verified'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-400 bg-amber-400/20 border-amber-400/30',
          label: 'Pending'
        };
      case 'unverified':
        return {
          icon: AlertTriangle,
          color: 'text-red-400 bg-red-400/20 border-red-400/30',
          label: 'Unverified'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-400 bg-gray-400/20 border-gray-400/30',
          label: 'Unknown'
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Residential': return Home;
      case 'Commercial': return Building;
      case 'Industrial': return Building;
      case 'Land': return Building;
      default: return Home;
    }
  };

  const statusConfig = getStatusConfig(property.status);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = getTypeIcon(property.type);

  const ownershipPercentage = property.total_shares ? (userShares / property.total_shares) * 100 : 0;
  const availablePercentage = property.total_shares && property.available_shares 
    ? (property.available_shares / property.total_shares) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg 
        border border-white/20 rounded-2xl overflow-hidden shadow-xl
        hover:shadow-2xl hover:border-emerald-400/30 transition-all duration-300
        cursor-pointer group
        ${variant === 'compact' ? 'max-w-sm' : ''}
      `}
    >
      {/* Property Image */}
      <div className="relative overflow-hidden">
        <motion.img
          src={property.image_url}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          whileHover={{ scale: 1.1 }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
            border backdrop-blur-xs ${statusConfig.color}
          `}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </div>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-blue-500/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <TypeIcon className="h-3 w-3" />
            <span>{property.type}</span>
          </div>
        </div>

        {/* User Ownership Badge */}
        {userShares > 0 && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-linear-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold">
              <span>You own {ownershipPercentage.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Availability Badge */}
        {property.available_shares && property.available_shares > 0 && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-emerald-500/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-medium">
              {availablePercentage.toFixed(0)}% Available
            </div>
          </div>
        )}

        {/* Rating and Views */}
        <div className="absolute top-16 right-4 flex flex-col space-y-2">
          {property.rating && (
            <div className="bg-amber-500/80 backdrop-blur-xs text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{property.rating}</span>
            </div>
          )}
          <div className="bg-gray-500/80 backdrop-blur-xs text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{property.views}</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end justify-center pb-4"
        >
          <div className="flex items-center space-x-2 text-white">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </motion.div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Title and Address */}
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-emerald-300 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="h-4 w-4 mr-1 text-emerald-400" />
            {property.address}, {property.city}, {property.state}
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="text-gray-300 text-xs">Total Value</span>
            </div>
            <p className="text-white font-semibold">{formatCurrency(property.price)}</p>
            {property.price_per_sqft && (
              <p className="text-gray-400 text-xs">{formatCurrency(property.price_per_sqft)}/sq ft</p>
            )}
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Home className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-xs">Size</span>
            </div>
            <p className="text-white font-semibold">{property.sqft.toLocaleString()} sq ft</p>
            {property.bedrooms && property.bathrooms && (
              <p className="text-gray-400 text-xs">{property.bedrooms}bd/{property.bathrooms}ba</p>
            )}
          </div>
        </div>

        {/* Fractional Ownership Details */}
        {property.ownership_type === 'Fractional' && property.total_shares && (
          <div className="bg-purple-500/10 rounded-lg p-3 mb-4 border border-purple-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-sm font-medium">Fractional Ownership</span>
              {property.share_price && (
                <span className="text-purple-400 font-semibold">{formatCurrency(property.share_price)}/share</span>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-300 mb-2">
              <span>{property.available_shares || 0} of {property.total_shares} shares available</span>
              {property.expected_return && (
                <span>{property.expected_return}% expected return</span>
              )}
            </div>
            <div className="w-full bg-purple-900/30 rounded-full h-2">
              <div 
                className="bg-linear-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                style={{ width: `${((property.total_shares - (property.available_shares || 0)) / property.total_shares) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Monthly Rent Collection */}
        {property.monthly_rent_collected && property.monthly_rent_collected > 0 && (
          <div className="bg-emerald-500/10 rounded-lg p-3 mb-4 border border-emerald-400/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">Monthly Rent</span>
              </div>
              <span className="text-emerald-400 font-semibold">{formatCurrency(property.monthly_rent_collected)}</span>
            </div>
            {property.last_rent_distribution && (
              <p className="text-gray-300 text-xs mt-1">
                Last distribution: {new Date(property.last_rent_distribution).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Investment Options */}
        <div className="space-y-2 mb-4">
          {property.rent_available && property.rent_price && (
            <div className="flex items-center justify-between bg-green-500/10 rounded-lg p-3 border border-green-400/20">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">Rent Available</span>
              </div>
              <span className="text-green-400 font-semibold">{formatCurrency(property.rent_price)}/mo</span>
            </div>
          )}
          {property.loan_available && property.interest_rate && (
            <div className="flex items-center justify-between bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Financing Available</span>
              </div>
              <div className="text-right">
                <p className="text-blue-400 font-semibold text-sm">{property.interest_rate}% APR</p>
                {property.loan_to_value && (
                  <p className="text-gray-400 text-xs">{property.loan_to_value}% LTV</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DAO Governance */}
        {property.dao_enabled && userShares > 0 && (
          <div className="bg-blue-500/10 rounded-lg p-3 mb-4 border border-blue-400/20">
            <div className="flex items-center space-x-2 mb-1">
              <Vote className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">DAO Governance</span>
            </div>
            <p className="text-gray-300 text-xs">
              You have {ownershipPercentage.toFixed(1)}% voting power in property decisions
            </p>
          </div>
        )}

        {/* Owner Info */}
        {showOwner && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300 text-xs">Owner</span>
            </div>
            <p className="text-white text-sm font-medium">{property.owner_name}</p>
          </div>
        )}

        {/* Blockchain Info */}
        {property.blockchain_token_id && (
          <div className="mb-4 p-3 bg-linear-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-400/20">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-medium">Blockchain Secured</span>
            </div>
            <p className="text-gray-300 text-xs font-mono">{property.blockchain_token_id}</p>
          </div>
        )}

        {/* Recorded Date */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
          </div>
          
          {property.status === 'verified' && (
            <div className="flex items-center space-x-1 text-emerald-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {property.fraction_available && property.available_shares && property.available_shares > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-linear-to-r from-purple-500 to-pink-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
            >
              <PieChart className="h-3 w-3" />
              <span>Buy</span>
            </motion.button>
          )}
          {property.rent_available && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-linear-to-r from-green-500 to-emerald-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
            >
              <Key className="h-3 w-3" />
              <span>Rent</span>
            </motion.button>
          )}
          {property.loan_available && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-linear-to-r from-blue-500 to-indigo-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
            >
              <CreditCard className="h-3 w-3" />
              <span>Loan</span>
            </motion.button>
          )}
          {(!property.fraction_available || !property.available_shares || property.available_shares === 0) && 
           !property.rent_available && !property.loan_available && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-3 bg-linear-to-r from-gray-600 to-gray-700 text-white py-2 px-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
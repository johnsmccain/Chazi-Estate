import React from 'react';
import { Badge } from '../ui/Badge';
import { CheckCircle, Clock, AlertTriangle, Star, Eye } from 'lucide-react';

interface PropertyBadgesProps {
  status: string;
  type: string;
  rating?: number;
  views: number;
  userShares?: number;
  totalShares?: number;
  availableShares?: number;
}

export const PropertyBadges: React.FC<PropertyBadgesProps> = ({
  status,
  type,
  rating,
  views,
  userShares = 0,
  totalShares,
  availableShares
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'unverified': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'unverified': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const ownershipPercentage = totalShares ? (userShares / totalShares) * 100 : 0;
  const availablePercentage = totalShares && availableShares 
    ? (availableShares / totalShares) * 100 
    : 0;

  return (
    <>
      {/* Status Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
        <Badge 
          variant={getStatusVariant(status)}
          icon={getStatusIcon(status)}
          size="sm"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      {/* Property Type Badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <div className="bg-blue-500/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
          <span className="hidden sm:inline">{type}</span>
          <span className="sm:hidden">{type.slice(0, 3)}</span>
        </div>
      </div>

      {/* User Ownership Badge */}
      {userShares > 0 && (
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
          <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
            <span>You own {ownershipPercentage.toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Availability Badge */}
      {availableShares && availableShares > 0 && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          <div className="bg-emerald-500/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
            {availablePercentage.toFixed(0)}% Available
          </div>
        </div>
      )}

      {/* Rating and Views */}
      <div className="absolute top-12 right-3 sm:top-16 sm:right-4 flex flex-col space-y-1 sm:space-y-2">
        {rating && (
          <Badge variant="warning" icon={Star} size="sm">
            {rating}
          </Badge>
        )}
        <Badge variant="neutral" icon={Eye} size="sm">
          <span className="hidden sm:inline">{views}</span>
          <span className="sm:hidden">{views > 999 ? '1k+' : views}</span>
        </Badge>
      </div>
    </>
  );
};
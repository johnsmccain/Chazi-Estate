import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Brain,
  Target,
  RefreshCw,
  Grid,
  List
} from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  filterOwnership: string;
  onFilterOwnershipChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  filterAvailability: string;
  onFilterAvailabilityChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showAIInsights: boolean;
  onToggleAIInsights: () => void;
  onRefresh: () => void;
  resultsCount: number;
  userPropertiesCount: number;
  user?: any;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterOwnership,
  onFilterOwnershipChange,
  priceRange,
  onPriceRangeChange,
  filterAvailability,
  onFilterAvailabilityChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  showAIInsights,
  onToggleAIInsights,
  onRefresh,
  resultsCount,
  userPropertiesCount,
  user
}) => {
  const propertyTypes = [
    { value: 'all', label: 'All Types 🏠' },
    { value: 'residential', label: 'Residential 🏡' },
    { value: 'commercial', label: 'Commercial 🏢' },
    { value: 'industrial', label: 'Industrial 🏭' },
    { value: 'land', label: 'Land 🌳' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
          <input
            type="text"
            placeholder="AI-powered search... 🧠"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
        </div>

        {/* Property Type Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 appearance-none transition-all"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Ownership Type Filter */}
        <div className="relative">
          <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
          <select
            value={filterOwnership}
            onChange={(e) => onFilterOwnershipChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 appearance-none transition-all"
          >
            <option value="all">All Ownership 👥</option>
            <option value="full">Full Ownership 🏠</option>
            <option value="fractional">Fractional 🥧</option>
            <option value="shared">Shared 🤝</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
          <select
            value={priceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 appearance-none transition-all"
          >
            <option value="all">All Prices 💰</option>
            <option value="under-1m">Under $1M</option>
            <option value="1m-3m">$1M - $3M</option>
            <option value="3m-5m">$3M - $5M</option>
            <option value="over-5m">Over $5M</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div className="relative">
          <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
          <select
            value={filterAvailability}
            onChange={(e) => onFilterAvailabilityChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 appearance-none transition-all"
          >
            <option value="all">All Available ✨</option>
            <option value="fraction">Fractions 🥧</option>
            <option value="rent">Rentals 🏠</option>
            <option value="loan">Loans 💳</option>
            {user && <option value="my-properties">My Properties 👤</option>}
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <Brain className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 appearance-none transition-all"
          >
            <option value="ai-recommended">🧠 AI Recommended</option>
            <option value="newest">Newest First 🆕</option>
            <option value="oldest">Oldest First 📅</option>
            <option value="price-high">Highest Price 💰</option>
            <option value="price-low">Lowest Price 💵</option>
            <option value="rating">Highest Rated ⭐</option>
            <option value="views">Most Viewed 👁️</option>
            <option value="availability">Most Available 📈</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-300 flex items-center space-x-2">
          <Target className="h-4 w-4 text-purple-400" />
          <span>{resultsCount} AI-curated properties found</span>
          {user && userPropertiesCount > 0 && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-purple-400">You own {userPropertiesCount} properties</span>
            </>
          )}
        </p>
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleAIInsights}
            className={`p-2 rounded-lg transition-colors ${
              showAIInsights ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Brain className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <motion.button
            onClick={onRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
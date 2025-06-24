import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '../components/PropertyCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AIPropertyAnalyzer } from '../components/AIPropertyAnalyzer';
import { AIInsightPanel } from '../components/AIInsightPanel';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter, 
  SortDesc, 
  MapPin, 
  DollarSign,
  Home,
  Building,
  Warehouse,
  TreePine,
  Heart,
  Sparkles,
  TrendingUp,
  Eye,
  PieChart,
  Key,
  CreditCard,
  Users,
  Star,
  Calendar,
  Percent,
  RefreshCw,
  Grid,
  List,
  Brain,
  Target,
  Zap
} from 'lucide-react';

// Mock property data as fallback
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Ocean View Condo',
    address: '123 Ocean Drive',
    city: 'Miami',
    state: 'FL',
    country: 'USA',
    type: 'Residential',
    price: 250000000, // $2,500,000 in cents
    price_per_sqft: 71400,
    sqft: 3500,
    bedrooms: 4,
    bathrooms: 3,
    year_built: 2019,
    description: 'Stunning oceanfront luxury condo with panoramic views.',
    image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    owner_id: null,
    owner_name: 'Sarah Johnson',
    ownership_type: 'Fractional',
    available_shares: 45,
    total_shares: 100,
    share_price: 2500000,
    status: 'verified',
    fraction_available: true,
    fraction_price: 2500000,
    min_investment: 500000,
    expected_return: 12.5,
    rent_available: false,
    rent_price: null,
    loan_available: true,
    loan_to_value: 80.0,
    interest_rate: 3.25,
    amenities: ['Ocean View', 'Pool', 'Gym', 'Concierge', 'Parking', 'Balcony'],
    rating: 4.8,
    views: 1247,
    monthly_rent_collected: 0,
    last_rent_distribution: null,
    dao_enabled: true,
    blockchain_token_id: 'ALG_550e8400',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Modern Tech Office Space',
    address: '456 Tech Plaza',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    type: 'Commercial',
    price: 520000000, // $5,200,000 in cents
    price_per_sqft: 34700,
    sqft: 15000,
    bedrooms: null,
    bathrooms: null,
    year_built: 2021,
    description: 'Prime commercial space in the heart of Silicon Valley.',
    image_url: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    owner_id: null,
    owner_name: 'TechCorp LLC',
    ownership_type: 'Fractional',
    available_shares: 20,
    total_shares: 100,
    share_price: 5200000,
    status: 'verified',
    fraction_available: true,
    fraction_price: 5200000,
    min_investment: 1000000,
    expected_return: 15.2,
    rent_available: true,
    rent_price: 2500000,
    loan_available: true,
    loan_to_value: 75.0,
    interest_rate: 4.15,
    amenities: ['High-Speed Internet', 'Conference Rooms', 'Parking', 'Security', 'Elevator'],
    rating: 4.9,
    views: 892,
    monthly_rent_collected: 2500000,
    last_rent_distribution: '2024-01-01',
    dao_enabled: true,
    blockchain_token_id: 'ALG_550e8401',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    title: 'Mountain View Family Home',
    address: '789 Mountain View Drive',
    city: 'Denver',
    state: 'CO',
    country: 'USA',
    type: 'Residential',
    price: 85000000, // $850,000 in cents
    price_per_sqft: 38600,
    sqft: 2200,
    bedrooms: 3,
    bathrooms: 2,
    year_built: 2018,
    description: 'Beautiful mountain home with stunning views.',
    image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    owner_id: null,
    owner_name: 'Mike Chen',
    ownership_type: 'Full',
    available_shares: null,
    total_shares: null,
    share_price: null,
    status: 'verified',
    fraction_available: false,
    fraction_price: null,
    min_investment: null,
    expected_return: null,
    rent_available: true,
    rent_price: 350000,
    loan_available: true,
    loan_to_value: 85.0,
    interest_rate: 3.75,
    amenities: ['Mountain View', 'Fireplace', 'Garage', 'Garden', 'Deck'],
    rating: 4.6,
    views: 634,
    monthly_rent_collected: 350000,
    last_rent_distribution: '2024-01-01',
    dao_enabled: false,
    blockchain_token_id: 'ALG_550e8402',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  }
];

// Helper function to format currency
const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

export const BrowsePropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [userShares, setUserShares] = useState<Record<string, number>>({});
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPropertyForAnalysis, setSelectedPropertyForAnalysis] = useState<any>(null);
  const [showAIInsights, setShowAIInsights] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOwnership, setFilterOwnership] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('ai-recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Load properties - using mock data as fallback
  const loadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, use mock data since Supabase might not be properly configured
      // In production, this would be:
      // const { propertyService } = await import('../lib/supabase');
      // const data = await propertyService.getProperties({ limit: 100 });
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProperties(mockProperties);
      
      // Mock user shares
      if (user?.id) {
        const mockShares: Record<string, number> = {
          '1': 15, // User owns 15% of property 1
          '2': 25, // User owns 25% of property 2
        };
        setUserShares(mockShares);
      }
      
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties. Using demo data instead.');
      // Still show mock data even if there's an error
      setProperties(mockProperties);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(property => property.status === filterStatus);
    }

    // Ownership filter
    if (filterOwnership !== 'all') {
      filtered = filtered.filter(property => 
        property.ownership_type.toLowerCase() === filterOwnership.toLowerCase()
      );
    }

    // Availability filter
    if (filterAvailability !== 'all') {
      switch (filterAvailability) {
        case 'fraction':
          filtered = filtered.filter(property => 
            property.fraction_available && property.available_shares && property.available_shares > 0
          );
          break;
        case 'rent':
          filtered = filtered.filter(property => property.rent_available);
          break;
        case 'loan':
          filtered = filtered.filter(property => property.loan_available);
          break;
        case 'my-properties':
          filtered = filtered.filter(property => userShares[property.id] > 0);
          break;
      }
    }

    // Price range filter
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-1m':
          filtered = filtered.filter(property => property.price < 100000000); // $1M in cents
          break;
        case '1m-3m':
          filtered = filtered.filter(property => 
            property.price >= 100000000 && property.price <= 300000000
          );
          break;
        case '3m-5m':
          filtered = filtered.filter(property => 
            property.price >= 300000000 && property.price <= 500000000
          );
          break;
        case 'over-5m':
          filtered = filtered.filter(property => property.price > 500000000);
          break;
      }
    }

    // Sorting with AI recommendations
    switch (sortBy) {
      case 'ai-recommended':
        // AI-based sorting considering user preferences, market trends, and property potential
        filtered.sort((a, b) => {
          const aScore = calculateAIScore(a);
          const bScore = calculateAIScore(b);
          return bScore - aScore;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'availability':
        filtered.sort((a, b) => {
          const aAvailable = a.available_shares || 0;
          const bAvailable = b.available_shares || 0;
          return bAvailable - aAvailable;
        });
        break;
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [properties, searchTerm, filterType, filterStatus, filterOwnership, filterAvailability, priceRange, sortBy, userShares]);

  // AI scoring algorithm for property recommendations
  const calculateAIScore = (property: any): number => {
    let score = 0;
    
    // Base score from rating
    score += (property.rating || 0) * 10;
    
    // Fractional availability bonus
    if (property.fraction_available && property.available_shares > 0) {
      score += 20;
    }
    
    // Expected return bonus
    if (property.expected_return) {
      score += property.expected_return * 2;
    }
    
    // Location bonus (major cities)
    if (['San Francisco', 'New York', 'Los Angeles', 'Miami'].includes(property.city)) {
      score += 15;
    }
    
    // User ownership bonus (diversification)
    if (!userShares[property.id]) {
      score += 10;
    }
    
    // Recent activity bonus
    const daysSinceCreated = (Date.now() - new Date(property.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 30) {
      score += 5;
    }
    
    return score;
  };

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential': return Home;
      case 'commercial': return Building;
      case 'industrial': return Warehouse;
      case 'land': return TreePine;
      default: return Home;
    }
  };

  const propertyTypes = [
    { value: 'all', label: 'All Types', icon: Home },
    { value: 'residential', label: 'Residential', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: Building },
    { value: 'industrial', label: 'Industrial', icon: Warehouse },
    { value: 'land', label: 'Land', icon: TreePine }
  ];

  const handlePropertyClick = async (property: any) => {
    // Increment views when property is clicked
    setProperties(prev => 
      prev.map(p => p.id === property.id ? { ...p, views: p.views + 1 } : p)
    );
  };

  if (error && properties.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Sparkles className="h-8 w-8 text-amber-400" />
            <span>Browse Properties</span>
            <Heart className="h-8 w-8 text-pink-400" />
          </h1>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-lg border border-red-400/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button
            onClick={loadProperties}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Brain className="h-8 w-8 text-purple-400" />
          <span>AI-Powered Property Discovery</span>
          <Heart className="h-8 w-8 text-pink-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover properties with intelligent recommendations, market insights, and personalized analysis ✨
        </p>
        {error && (
          <p className="text-amber-400 text-sm mt-2">
            ⚠️ Using demo data - some features may be limited
          </p>
        )}
      </motion.div>

      {/* AI Insights Panel */}
      {showAIInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AIInsightPanel 
            userPortfolio={properties.filter(p => userShares[p.id] > 0)}
            marketData={{ trends: 'bullish', growth: 15 }}
          />
        </motion.div>
      )}

      {/* Search and Filters */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
            />
          </div>

          {/* Property Type Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
              onChange={(e) => setFilterOwnership(e.target.value)}
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
              onChange={(e) => setPriceRange(e.target.value)}
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
              onChange={(e) => setFilterAvailability(e.target.value)}
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
              onChange={(e) => setSortBy(e.target.value)}
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

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {propertyTypes.slice(1).map((type) => {
            const IconComponent = type.icon;
            return (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(filterType === type.value ? 'all' : type.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  filterType === type.value
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-300 flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-400" />
            <span>{filteredProperties.length} AI-curated properties found</span>
            {user && Object.keys(userShares).length > 0 && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-purple-400">You own {Object.keys(userShares).length} properties</span>
              </>
            )}
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className={`p-2 rounded-lg transition-colors ${
                showAIInsights ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Brain className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <motion.button
              onClick={loadProperties}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Properties Grid/List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner message="AI is finding the perfect properties for you..." size="lg" />
        </div>
      ) : (
        <>
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
              {paginatedProperties.map((property, index) => (
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
                    onClick={() => handlePropertyClick(property)}
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
                      setSelectedPropertyForAnalysis(property);
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

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center space-x-4 mt-8"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                Next
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* AI Property Analyzer Modal */}
      <AnimatePresence>
        {selectedPropertyForAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPropertyForAnalysis(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-purple-400" />
                    <span>AI Property Analysis</span>
                  </h2>
                  <button
                    onClick={() => setSelectedPropertyForAnalysis(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <AIPropertyAnalyzer
                  property={selectedPropertyForAnalysis}
                  autoStart={true}
                  onAnalysisComplete={(analysis) => {
                    console.log('Analysis complete:', analysis);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProperties.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Brain className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">No properties found</h3>
          <p className="text-gray-300 text-lg mb-6">
            Try adjusting your search with different terms or let AI help you find better matches 💫
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStatus('all');
              setFilterOwnership('all');
              setFilterAvailability('all');
              setPriceRange('all');
              setSortBy('ai-recommended');
            }}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Reset Filters & Get AI Recommendations
          </button>
        </motion.div>
      )}
    </div>
  );
};
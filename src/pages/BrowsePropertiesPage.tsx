import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AIPropertyAnalyzer } from '../components/AIPropertyAnalyzer';
import { AIInsightPanel } from '../components/AIInsightPanel';
import { SearchFilters } from '../components/browse/SearchFilters';
import { PropertyGrid } from '../components/browse/PropertyGrid';
import { Pagination } from '../components/browse/Pagination';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain,
  Heart,
  Sparkles,
  Target
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
          filtered = filtered.filter(property => property.price < 100000000);
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
    setCurrentPage(1);
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

  const handlePropertyClick = async (property: any) => {
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
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterOwnership={filterOwnership}
        onFilterOwnershipChange={setFilterOwnership}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        filterAvailability={filterAvailability}
        onFilterAvailabilityChange={setFilterAvailability}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showAIInsights={showAIInsights}
        onToggleAIInsights={() => setShowAIInsights(!showAIInsights)}
        onRefresh={loadProperties}
        resultsCount={filteredProperties.length}
        userPropertiesCount={Object.keys(userShares).length}
        user={user}
      />

      {/* Properties Grid/List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner message="AI is finding the perfect properties for you..." size="lg" />
        </div>
      ) : (
        <>
          <PropertyGrid
            properties={paginatedProperties}
            viewMode={viewMode}
            sortBy={sortBy}
            userShares={userShares}
            onPropertyClick={handlePropertyClick}
            onAnalyzeProperty={setSelectedPropertyForAnalysis}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '../components/PropertyCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Search, 
  MapPin, 
  Building2, 
  Shield, 
  Eye,
  Filter,
  SortDesc,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Home,
  Zap,
  Sparkles,
  Heart,
  X
} from 'lucide-react';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  type: string;
  value: string;
  owner: string;
  status: 'verified' | 'pending' | 'unverified';
  recordedDate: string;
  image: string;
  transactionHash?: string;
  sqft: string;
  bedrooms?: number;
  bathrooms?: number;
}

export const ExplorerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock property data - in a real app, this would come from blockchain/API
  const [properties] = useState<Property[]>([
    {
      id: '1',
      address: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      type: 'Residential',
      value: '$850,000',
      owner: 'John Smith',
      status: 'verified',
      recordedDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      transactionHash: '0x1a2b3c4d5e6f',
      sqft: '2,000',
      bedrooms: 3,
      bathrooms: 2
    },
    {
      id: '2',
      address: '456 Pine Avenue',
      city: 'Los Angeles',
      state: 'CA',
      type: 'Commercial',
      value: '$1,200,000',
      owner: 'ABC Corporation',
      status: 'verified',
      recordedDate: '2024-01-10',
      image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      transactionHash: '0x2b3c4d5e6f7a',
      sqft: '5,000'
    },
    {
      id: '3',
      address: '789 Maple Drive',
      city: 'Seattle',
      state: 'WA',
      type: 'Residential',
      value: '$675,000',
      owner: 'Jane Doe',
      status: 'pending',
      recordedDate: '2024-01-12',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      sqft: '1,800',
      bedrooms: 2,
      bathrooms: 2
    },
    {
      id: '4',
      address: '321 Cedar Lane',
      city: 'Portland',
      state: 'OR',
      type: 'Industrial',
      value: '$2,100,000',
      owner: 'Industrial Holdings LLC',
      status: 'verified',
      recordedDate: '2024-01-08',
      image: 'https://images.pexels.com/photos/1570264/pexels-photo-1570264.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      transactionHash: '0x3c4d5e6f7a8b',
      sqft: '25,000'
    },
    {
      id: '5',
      address: '654 Birch Road',
      city: 'Denver',
      state: 'CO',
      type: 'Residential',
      value: '$520,000',
      owner: 'Mike Johnson',
      status: 'unverified',
      recordedDate: '2024-01-14',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      sqft: '1,500',
      bedrooms: 3,
      bathrooms: 1
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.recordedDate).getTime() - new Date(a.recordedDate).getTime();
        case 'oldest':
          return new Date(a.recordedDate).getTime() - new Date(b.recordedDate).getTime();
        case 'value-high':
          return parseInt(b.value.replace(/[$,]/g, '')) - parseInt(a.value.replace(/[$,]/g, ''));
        case 'value-low':
          return parseInt(a.value.replace(/[$,]/g, '')) - parseInt(b.value.replace(/[$,]/g, ''));
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">DeedAI</span>
              <Sparkles className="h-5 w-5 text-amber-400" />
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/explorer" className="text-emerald-300 font-medium flex items-center space-x-1">
                <span>Explorer</span>
                <Heart className="h-4 w-4" />
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
            </nav>

            <Link
              to="/login"
              className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4 flex items-center justify-center space-x-3"
            >
              <Sparkles className="h-12 w-12 text-amber-400" />
              <span>Property Deed Explorer</span>
              <Heart className="h-12 w-12 text-pink-400" />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Discover and verify property ownership records secured with love on the blockchain ✨
            </motion.p>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search with love... 💚"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>

              {/* Property Type Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 appearance-none transition-all"
                >
                  <option value="all">All Types 🏠</option>
                  <option value="residential">Residential 🏡</option>
                  <option value="commercial">Commercial 🏢</option>
                  <option value="industrial">Industrial 🏭</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 appearance-none transition-all"
                >
                  <option value="all">All Status ✨</option>
                  <option value="verified">Verified ✅</option>
                  <option value="pending">Pending ⏳</option>
                  <option value="unverified">Unverified ❌</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <SortDesc className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 appearance-none transition-all"
                >
                  <option value="newest">Newest First 🆕</option>
                  <option value="oldest">Oldest First 📅</option>
                  <option value="value-high">Highest Value 💰</option>
                  <option value="value-low">Lowest Value 💵</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-gray-300 flex items-center space-x-2">
                <Heart className="h-4 w-4 text-pink-400" />
                <span>{filteredProperties.length} properties found with love</span>
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span>Unverified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Properties Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner message="Finding amazing properties for you..." size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PropertyCard
                      property={property}
                      onClick={() => setSelectedProperty(property)}
                      showOwner={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {filteredProperties.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">No properties found</h3>
              <p className="text-gray-300 text-lg mb-6">
                Try adjusting your search with different terms or filters 💫
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                }}
                className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Property Detail Modal */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProperty(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-linear-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.address}
                    className="w-full h-80 object-cover"
                  />
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-6 right-6 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-6 left-6">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-xs ${
                      selectedProperty.status === 'verified' 
                        ? 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
                        : selectedProperty.status === 'pending'
                        ? 'text-amber-400 bg-amber-400/20 border-amber-400/30'
                        : 'text-red-400 bg-red-400/20 border-red-400/30'
                    }`}>
                      {selectedProperty.status === 'verified' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {selectedProperty.status === 'pending' && <Clock className="h-4 w-4 mr-2" />}
                      {selectedProperty.status === 'unverified' && <AlertCircle className="h-4 w-4 mr-2" />}
                      <span className="capitalize">{selectedProperty.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center space-x-2">
                    <span>{selectedProperty.address}</span>
                    <Heart className="h-6 w-6 text-pink-400" />
                  </h2>
                  <p className="text-gray-300 text-lg mb-8 flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    <span>{selectedProperty.city}, {selectedProperty.state}</span>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-linear-to-br from-white/10 to-white/5 rounded-2xl p-6">
                      <h3 className="text-white font-semibold text-xl mb-4 flex items-center space-x-2">
                        <Home className="h-5 w-5 text-blue-400" />
                        <span>Property Details</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white font-medium">{selectedProperty.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Value:</span>
                          <span className="text-emerald-400 font-semibold text-lg">{selectedProperty.value}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Size:</span>
                          <span className="text-white font-medium">{selectedProperty.sqft} sq ft</span>
                        </div>
                        {selectedProperty.bedrooms && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Bedrooms:</span>
                            <span className="text-white font-medium">{selectedProperty.bedrooms}</span>
                          </div>
                        )}
                        {selectedProperty.bathrooms && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Bathrooms:</span>
                            <span className="text-white font-medium">{selectedProperty.bathrooms}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-white/10 to-white/5 rounded-2xl p-6">
                      <h3 className="text-white font-semibold text-xl mb-4 flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-purple-400" />
                        <span>Ownership & Blockchain</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Owner:</span>
                          <span className="text-white font-medium">{selectedProperty.owner}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Recorded:</span>
                          <span className="text-white font-medium">
                            {new Date(selectedProperty.recordedDate).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedProperty.transactionHash && (
                          <div>
                            <span className="text-gray-400 block mb-1">Transaction Hash:</span>
                            <p className="text-blue-400 text-sm font-mono break-all bg-white/5 rounded-lg p-2">
                              {selectedProperty.transactionHash}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedProperty.status === 'verified' && (
                    <div className="bg-linear-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 rounded-2xl p-6 mb-8">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-lg">Blockchain Verified with Love</span>
                        <Sparkles className="h-5 w-5 text-amber-400" />
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        This property deed has been lovingly verified and recorded on the Algorand blockchain, 
                        ensuring your ownership is protected forever with immutable records and smart contract magic! 💫
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-linear-to-r from-emerald-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-5 w-5" />
                      <span>View Full Record</span>
                      <Heart className="h-4 w-4" />
                    </motion.button>
                    <Link
                      to="/login"
                      className="flex-1 bg-linear-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="h-5 w-5" />
                      <span>Get Started</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Built with Bolt.new Badge */}
      <div className="fixed bottom-4 right-4">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-linear-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
        >
          <Zap className="h-4 w-4" />
          <span>Built with Bolt.new</span>
          <Heart className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
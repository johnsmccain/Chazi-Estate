import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  MapPin, 
  DollarSign, 
  Calendar,
  Heart,
  Sparkles,
  Filter,
  Search,
  Home,
  Building,
  Users,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  Shield,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface RentalProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  type: string;
  monthlyRent: string;
  deposit: string;
  bedrooms: number;
  bathrooms: number;
  sqft: string;
  availableDate: string;
  leaseTerm: string;
  image: string;
  amenities: string[];
  rating: number;
  reviews: number;
  petFriendly: boolean;
  furnished: boolean;
  utilities: string[];
}

export const RentPropertyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<RentalProperty | null>(null);

  // Mock rental properties
  const properties: RentalProperty[] = [
    {
      id: '1',
      address: '123 Sunset Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      type: 'Apartment',
      monthlyRent: '$3,200',
      deposit: '$3,200',
      bedrooms: 2,
      bathrooms: 2,
      sqft: '1,200',
      availableDate: '2024-02-01',
      leaseTerm: '12 months',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      amenities: ['Pool', 'Gym', 'Parking', 'WiFi'],
      rating: 4.8,
      reviews: 124,
      petFriendly: true,
      furnished: false,
      utilities: ['Water', 'Trash']
    },
    {
      id: '2',
      address: '456 Tech Square',
      city: 'San Francisco',
      state: 'CA',
      type: 'Condo',
      monthlyRent: '$4,500',
      deposit: '$4,500',
      bedrooms: 1,
      bathrooms: 1,
      sqft: '800',
      availableDate: '2024-01-15',
      leaseTerm: '12 months',
      image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      amenities: ['Rooftop', 'Concierge', 'Gym', 'WiFi'],
      rating: 4.9,
      reviews: 89,
      petFriendly: false,
      furnished: true,
      utilities: ['All Utilities']
    },
    {
      id: '3',
      address: '789 Mountain View',
      city: 'Denver',
      state: 'CO',
      type: 'House',
      monthlyRent: '$2,800',
      deposit: '$2,800',
      bedrooms: 3,
      bathrooms: 2,
      sqft: '1,800',
      availableDate: '2024-02-15',
      leaseTerm: '12 months',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      amenities: ['Yard', 'Garage', 'Fireplace'],
      rating: 4.7,
      reviews: 156,
      petFriendly: true,
      furnished: false,
      utilities: ['Gas', 'Water']
    },
    {
      id: '4',
      address: '321 Downtown Plaza',
      city: 'Austin',
      state: 'TX',
      type: 'Loft',
      monthlyRent: '$2,200',
      deposit: '$2,200',
      bedrooms: 1,
      bathrooms: 1,
      sqft: '900',
      availableDate: '2024-01-20',
      leaseTerm: '12 months',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      amenities: ['Pool', 'Gym', 'Rooftop', 'WiFi'],
      rating: 4.6,
      reviews: 203,
      petFriendly: true,
      furnished: true,
      utilities: ['Electric', 'Water']
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const rent = parseInt(property.monthlyRent.replace(/[$,]/g, ''));
      switch (priceRange) {
        case 'under-2000':
          matchesPrice = rent < 2000;
          break;
        case '2000-3000':
          matchesPrice = rent >= 2000 && rent <= 3000;
          break;
        case '3000-4000':
          matchesPrice = rent >= 3000 && rent <= 4000;
          break;
        case 'over-4000':
          matchesPrice = rent > 4000;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'pool': return '🏊‍♂️';
      case 'gym': return <Dumbbell className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'rooftop': return '🏢';
      case 'concierge': return '🛎️';
      case 'yard': return '🌳';
      case 'garage': return <Car className="h-4 w-4" />;
      case 'fireplace': return '🔥';
      default: return '✨';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Key className="h-8 w-8 text-green-400" />
          <span>Find Your Perfect Rental</span>
          <Heart className="h-6 w-6 text-pink-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover amazing rental properties with blockchain-verified ownership and instant booking ✨
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
            <input
              type="text"
              placeholder="Search by location... 🏠"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
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
              <option value="all">All Types 🏠</option>
              <option value="apartment">Apartment 🏢</option>
              <option value="house">House 🏡</option>
              <option value="condo">Condo 🏘️</option>
              <option value="loft">Loft 🏭</option>
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
              <option value="under-2000">Under $2,000</option>
              <option value="2000-3000">$2,000 - $3,000</option>
              <option value="3000-4000">$3,000 - $4,000</option>
              <option value="over-4000">Over $4,000</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-300 flex items-center space-x-2">
            <Heart className="h-4 w-4 text-pink-400" />
            <span>{filteredProperties.length} amazing rentals found</span>
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>Available</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Properties Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProperty(property)}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-green-400/30 transition-all duration-300">
                {/* Property Image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Available Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-green-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Available</span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-amber-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{property.rating}</span>
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    {property.furnished && (
                      <div className="bg-purple-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        🛋️ Furnished
                      </div>
                    )}
                    {property.petFriendly && (
                      <div className="bg-blue-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        🐕 Pet Friendly
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-white font-semibold text-xl mb-2 group-hover:text-green-300 transition-colors">
                    {property.address}
                  </h3>
                  <div className="flex items-center text-gray-300 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-green-400" />
                    {property.city}, {property.state}
                  </div>

                  {/* Property Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Home className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-white font-semibold text-sm">{property.bedrooms}</p>
                      <p className="text-gray-300 text-xs">Beds</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="w-4 h-4 bg-purple-400 rounded mx-auto mb-1"></div>
                      <p className="text-white font-semibold text-sm">{property.bathrooms}</p>
                      <p className="text-gray-300 text-xs">Baths</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Building className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-white font-semibold text-sm">{property.sqft}</p>
                      <p className="text-gray-300 text-xs">Sq Ft</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.slice(0, 4).map((amenity, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg px-2 py-1 flex items-center space-x-1">
                        {typeof getAmenityIcon(amenity) === 'string' ? (
                          <span className="text-xs">{getAmenityIcon(amenity)}</span>
                        ) : (
                          getAmenityIcon(amenity)
                        )}
                        <span className="text-gray-300 text-xs">{amenity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 mb-4 border border-green-400/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300 text-sm">Monthly Rent</p>
                        <p className="text-green-400 font-bold text-xl">{property.monthlyRent}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">Deposit</p>
                        <p className="text-white font-semibold">{property.deposit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span>Available {new Date(property.availableDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span>{property.leaseTerm}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Key className="h-4 w-4" />
                    <span>View & Apply</span>
                    <Heart className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Property Details Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
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
                  ✕
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedProperty.address}</h2>
                    <p className="text-gray-300 text-lg flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-400" />
                      <span>{selectedProperty.city}, {selectedProperty.state}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-3xl font-bold">{selectedProperty.monthlyRent}</p>
                    <p className="text-gray-300">per month</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Property Details */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6">
                      <h3 className="text-white font-semibold text-xl mb-4">Property Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Bedrooms:</span>
                          <p className="text-white font-semibold">{selectedProperty.bedrooms}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Bathrooms:</span>
                          <p className="text-white font-semibold">{selectedProperty.bathrooms}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Square Feet:</span>
                          <p className="text-white font-semibold">{selectedProperty.sqft}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Type:</span>
                          <p className="text-white font-semibold">{selectedProperty.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6">
                      <h3 className="text-white font-semibold text-xl mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProperty.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-gray-300">
                            {typeof getAmenityIcon(amenity) === 'string' ? (
                              <span>{getAmenityIcon(amenity)}</span>
                            ) : (
                              getAmenityIcon(amenity)
                            )}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lease Information */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-400/20">
                      <h3 className="text-white font-semibold text-xl mb-4">Lease Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Monthly Rent:</span>
                          <span className="text-green-400 font-semibold">{selectedProperty.monthlyRent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Security Deposit:</span>
                          <span className="text-white font-semibold">{selectedProperty.deposit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Lease Term:</span>
                          <span className="text-white font-semibold">{selectedProperty.leaseTerm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Available Date:</span>
                          <span className="text-white font-semibold">
                            {new Date(selectedProperty.availableDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6">
                      <h3 className="text-white font-semibold text-xl mb-4">Utilities & Features</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400 text-sm">Included Utilities:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedProperty.utilities.map((utility, idx) => (
                              <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                                {utility}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Pet Friendly:</span>
                            <span className={`font-semibold ${selectedProperty.petFriendly ? 'text-green-400' : 'text-red-400'}`}>
                              {selectedProperty.petFriendly ? 'Yes 🐕' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Furnished:</span>
                            <span className={`font-semibold ${selectedProperty.furnished ? 'text-green-400' : 'text-gray-400'}`}>
                              {selectedProperty.furnished ? 'Yes 🛋️' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Key className="h-5 w-5" />
                    <span>Apply Now</span>
                    <Heart className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/10 border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Coffee className="h-4 w-4" />
                    <span>Schedule Tour</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProperties.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Key className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">No rentals found</h3>
          <p className="text-gray-300 text-lg mb-6">
            Try adjusting your search criteria to find more properties 💫
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setPriceRange('all');
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};
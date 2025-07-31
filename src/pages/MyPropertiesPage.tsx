import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Plus, 
  Building, 
  TrendingUp,
  DollarSign,
  PieChart,
  Heart,
  Sparkles,
  Filter,
  Eye,
  Edit,
  Share2,
  MoreVertical,
  Calendar,
  MapPin
} from 'lucide-react';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  type: string;
  value: string;
  status: 'verified' | 'pending' | 'unverified';
  recordedDate: string;
  image: string;
  sqft: string;
  bedrooms?: number;
  bathrooms?: number;
  ownership: number; // percentage owned
  monthlyIncome?: string;
  appreciation?: string;
}

export const MyPropertiesPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Mock user properties
  const properties: Property[] = [
    {
      id: '1',
      address: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      type: 'Residential',
      value: '$850,000',
      status: 'verified',
      recordedDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      sqft: '2,000',
      bedrooms: 3,
      bathrooms: 2,
      ownership: 100,
      monthlyIncome: '$3,200',
      appreciation: '+12%'
    },
    {
      id: '2',
      address: '456 Pine Avenue',
      city: 'Los Angeles',
      state: 'CA',
      type: 'Commercial',
      value: '$1,200,000',
      status: 'verified',
      recordedDate: '2024-01-10',
      image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      sqft: '5,000',
      ownership: 25,
      monthlyIncome: '$1,500',
      appreciation: '+8%'
    },
    {
      id: '3',
      address: '789 Maple Drive',
      city: 'Seattle',
      state: 'WA',
      type: 'Residential',
      value: '$675,000',
      status: 'pending',
      recordedDate: '2024-01-12',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      sqft: '1,800',
      bedrooms: 2,
      bathrooms: 2,
      ownership: 50,
      monthlyIncome: '$1,200',
      appreciation: '+5%'
    }
  ];

  const filteredProperties = properties.filter(property => 
    filterStatus === 'all' || property.status === filterStatus
  );

  const totalValue = properties.reduce((sum, property) => {
    const value = parseInt(property.value.replace(/[$,]/g, ''));
    return sum + (value * property.ownership / 100);
  }, 0);

  const totalMonthlyIncome = properties.reduce((sum, property) => {
    if (property.monthlyIncome) {
      const income = parseInt(property.monthlyIncome.replace(/[$,]/g, ''));
      return sum + income;
    }
    return sum;
  }, 0);

  const stats = [
    {
      label: 'Total Portfolio Value',
      value: `$${(totalValue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'from-emerald-400 to-blue-500',
      change: '+15% this year'
    },
    {
      label: 'Properties Owned',
      value: properties.length.toString(),
      icon: Building,
      color: 'from-blue-400 to-purple-500',
      change: '+1 this month'
    },
    {
      label: 'Monthly Income',
      value: `$${(totalMonthlyIncome / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      color: 'from-purple-400 to-pink-500',
      change: '+8% this month'
    },
    {
      label: 'Avg Ownership',
      value: `${Math.round(properties.reduce((sum, p) => sum + p.ownership, 0) / properties.length)}%`,
      icon: PieChart,
      color: 'from-amber-400 to-orange-500',
      change: 'Diversified'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
            <Building className="h-8 w-8 text-emerald-400" />
            <span>My Properties</span>
            <Heart className="h-6 w-6 text-pink-400" />
          </h1>
          <p className="text-xl text-gray-300">
            Manage your real estate portfolio with love ✨
          </p>
        </div>
        <Link
          to="/create-deed"
          className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Property</span>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-emerald-400 text-xs font-medium">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-blue-400" />
            <span className="text-white font-medium">Filter Properties</span>
          </div>
          <div className="flex space-x-2">
            {['all', 'verified', 'pending', 'unverified'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  filterStatus === status
                    ? 'bg-linear-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium capitalize">
                  {status === 'all' ? 'All' : status}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Properties Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-emerald-400/30 transition-all duration-300">
                {/* Property Image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    whileHover={{ scale: 1.1 }}
                  />
                  
                  {/* Ownership Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {property.ownership}% Owned
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-xs ${
                      property.status === 'verified' 
                        ? 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
                        : property.status === 'pending'
                        ? 'text-amber-400 bg-amber-400/20 border-amber-400/30'
                        : 'text-red-400 bg-red-400/20 border-red-400/30'
                    }`}>
                      {property.status === 'verified' && '✅'}
                      {property.status === 'pending' && '⏳'}
                      {property.status === 'unverified' && '❌'}
                      <span className="ml-1 capitalize">{property.status}</span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute bottom-4 right-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-xs text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-emerald-300 transition-colors">
                    {property.address}
                  </h3>
                  <div className="flex items-center text-gray-300 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-emerald-400" />
                    {property.city}, {property.state}
                  </div>

                  {/* Property Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-3 w-3 text-emerald-400" />
                        <span className="text-gray-300 text-xs">Value</span>
                      </div>
                      <p className="text-white font-semibold text-sm">{property.value}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Building className="h-3 w-3 text-blue-400" />
                        <span className="text-gray-300 text-xs">Size</span>
                      </div>
                      <p className="text-white font-semibold text-sm">{property.sqft} sq ft</p>
                    </div>
                  </div>

                  {/* Income & Appreciation */}
                  {property.monthlyIncome && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-400/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-300 text-xs">Monthly Income</span>
                        </div>
                        <p className="text-emerald-400 font-semibold text-sm">{property.monthlyIncome}</p>
                      </div>
                      
                      <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-400/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <PieChart className="h-3 w-3 text-purple-400" />
                          <span className="text-purple-300 text-xs">Appreciation</span>
                        </div>
                        <p className="text-purple-400 font-semibold text-sm">{property.appreciation}</p>
                      </div>
                    </div>
                  )}

                  {/* Recorded Date */}
                  <div className="flex items-center text-gray-300 text-sm mb-4">
                    <Calendar className="h-4 w-4 mr-2 text-amber-400" />
                    <span>Recorded {new Date(property.recordedDate).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-linear-to-r from-emerald-500 to-blue-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-linear-to-r from-purple-500 to-pink-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Share2 className="h-3 w-3" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProperties.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Building className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">No properties found</h3>
          <p className="text-gray-300 text-lg mb-6">
            {filterStatus === 'all' 
              ? "Ready to add your first property? Let's get started!"
              : `No ${filterStatus} properties found. Try a different filter.`
            }
          </p>
          <Link
            to="/create-deed"
            className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Property</span>
            <Heart className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Home, FileText, Shield, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProperty } from '../../contexts/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { StatsCard } from './StatsCard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { properties, deeds } = useProperty();

  const userProperties = properties.filter(p => p.ownerId === user?.id);
  const userDeeds = deeds.filter(d => d.ownerId === user?.id);

  const stats = [
    {
      label: 'Total Properties',
      value: userProperties.length,
      icon: Home,
      color: 'blue',
      change: '+12%',
    },
    {
      label: 'Active Deeds',
      value: userDeeds.filter(d => d.status === 'active').length,
      icon: FileText,
      color: 'green',
      change: '+8%',
    },
    {
      label: 'Portfolio Value',
      value: `$${userProperties.reduce((sum, p) => sum + p.valuation, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'purple',
      change: '+15%',
    },
    {
      label: 'Verified Properties',
      value: userProperties.filter(p => p.status === 'verified').length,
      icon: Shield,
      color: 'orange',
      change: '+5%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your property portfolio and blockchain deeds
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to="/explorer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Explore</span>
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
            <Link
              to="/upload"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Add New Property
            </Link>
          </div>

          {userProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first property to the blockchain
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Property</span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
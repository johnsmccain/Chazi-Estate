import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 lg:p-6 border-b border-white/10">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <motion.img
          whileHover={{ scale: 1.1 }}
          src={user?.picture || '/api/placeholder/48/48'}
          alt={user?.name}
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl object-cover shadow-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate text-sm lg:text-base">{user?.name}</p>
          <p className="text-emerald-300 text-xs lg:text-sm truncate">{user?.email}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-400 rounded-full shadow-lg flex-shrink-0"
        />
      </div>
    </div>
  );
};
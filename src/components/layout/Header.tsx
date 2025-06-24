import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  description,
  onMenuClick
}) => {
  const { user } = useAuth();

  return (
    <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
      <div className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
            <motion.button
              onClick={onMenuClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-white truncate">
                {title}
              </h1>
              {description && (
                <p className="text-gray-300 text-xs lg:text-sm truncate hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 lg:p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg lg:rounded-xl transition-all duration-300"
            >
              <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1 right-1 lg:top-2 lg:right-2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-400 rounded-full"
              />
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 lg:space-x-3 bg-white/5 rounded-lg lg:rounded-xl p-1.5 lg:p-2 border border-white/10"
            >
              <img
                src={user?.picture || '/api/placeholder/32/32'}
                alt={user?.name}
                className="h-6 w-6 lg:h-8 lg:w-8 rounded-md lg:rounded-lg object-cover flex-shrink-0"
              />
              <div className="hidden sm:block min-w-0">
                <p className="text-white text-xs lg:text-sm font-medium truncate">{user?.name?.split(' ')[0]}</p>
                <div className="flex items-center space-x-1">
                  <Heart className="h-2 w-2 lg:h-3 lg:w-3 text-pink-400 flex-shrink-0" />
                  <span className="text-emerald-300 text-xs">Online</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};
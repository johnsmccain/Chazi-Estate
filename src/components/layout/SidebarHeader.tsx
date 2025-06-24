import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Sparkles, X } from 'lucide-react';

interface SidebarHeaderProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onClose,
  showCloseButton = false
}) => {
  return (
    <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10 min-h-[64px]">
      <Link 
        to="/dashboard" 
        className="flex items-center space-x-2 lg:space-x-3"
        onClick={onClose}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
        >
          <Building2 className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
        </motion.div>
        <div>
          <span className="text-lg lg:text-xl font-bold text-white">DeedAI</span>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-2 w-2 lg:h-3 lg:w-3 text-amber-400" />
            <span className="text-xs text-emerald-300 font-medium">Pro</span>
          </div>
        </div>
      </Link>
      {showCloseButton && (
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
};
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { 
  Home, 
  Search, 
  Building2,
  PieChart,
  Key,
  CreditCard,
  FileText,
  Vote,
  Shield,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
}

interface SidebarProps {
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: 'Home',
      description: 'Your dashboard overview',
      color: 'from-emerald-400 to-blue-500'
    },
    { 
      path: '/browse', 
      icon: Search, 
      label: 'Browse Properties',
      description: 'Discover amazing properties',
      color: 'from-blue-400 to-purple-500'
    },
    { 
      path: '/my-properties', 
      icon: Building2, 
      label: 'My Properties',
      description: 'Manage your portfolio',
      color: 'from-purple-400 to-pink-500'
    },
    { 
      path: '/buy-fraction', 
      icon: PieChart, 
      label: 'Buy Fraction',
      description: 'Fractional ownership',
      color: 'from-amber-400 to-orange-500'
    },
    { 
      path: '/rent', 
      icon: Key, 
      label: 'Rent Property',
      description: 'Find rental opportunities',
      color: 'from-green-400 to-emerald-500'
    },
    { 
      path: '/loan', 
      icon: CreditCard, 
      label: 'Loan Property',
      description: 'Property financing',
      color: 'from-indigo-400 to-blue-500'
    },
    { 
      path: '/dao', 
      icon: Vote, 
      label: 'DAO Governance',
      description: 'Property voting & decisions',
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      path: '/deed-generator', 
      icon: Shield, 
      label: 'Deed Generator',
      description: 'AI-powered deed creation',
      color: 'from-emerald-400 to-teal-500'
    },
    { 
      path: '/create-deed', 
      icon: FileText, 
      label: 'Create Deed',
      description: 'Generate new deeds',
      color: 'from-pink-400 to-rose-500'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
      {navItems.map((item, index) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={item.path}
            onClick={onItemClick}
            className={`group flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-300 ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 shadow-lg'
                : 'hover:bg-white/5 hover:border-white/10 border border-transparent'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-gradient-to-br ${item.color} shadow-lg flex-shrink-0 ${
                isActive(item.path) ? 'shadow-emerald-500/25' : ''
              }`}
            >
              <item.icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold transition-colors text-sm lg:text-base ${
                isActive(item.path) ? 'text-emerald-300' : 'text-white group-hover:text-emerald-300'
              }`}>
                {item.label}
              </p>
              <p className="text-gray-400 text-xs lg:text-sm truncate group-hover:text-gray-300 transition-colors">
                {item.description}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: isActive(item.path) ? 1 : 0,
                x: isActive(item.path) ? 0 : -10
              }}
              className="text-emerald-400 flex-shrink-0"
            >
              <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </nav>
  );
};
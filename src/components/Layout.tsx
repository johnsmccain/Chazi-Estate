import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Building2,
  PieChart,
  Key,
  CreditCard,
  FileText,
  User, 
  LogOut, 
  Zap,
  Menu,
  X,
  Bell,
  Settings,
  Heart,
  Sparkles,
  ChevronRight,
  Vote,
  Shield
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Building2 className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <span className="text-xl font-bold text-white">DeedAI</span>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span className="text-xs text-emerald-300 font-medium">Pro</span>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={user?.picture || '/api/placeholder/48/48'}
              alt={user?.name}
              className="h-12 w-12 rounded-xl object-cover shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{user?.name}</p>
              <p className="text-emerald-300 text-sm truncate">{user?.email}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 shadow-lg'
                    : 'hover:bg-white/5 hover:border-white/10 border border-transparent'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg ${
                    isActive(item.path) ? 'shadow-emerald-500/25' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold transition-colors ${
                    isActive(item.path) ? 'text-emerald-300' : 'text-white group-hover:text-emerald-300'
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: isActive(item.path) ? 1 : 0,
                    x: isActive(item.path) ? 0 : -10
                  }}
                  className="text-emerald-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/settings"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
          >
            <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
          >
            <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        {/* Top Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-gray-300 text-sm">
                    {navItems.find(item => item.path === location.pathname)?.description || 'Welcome back!'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  <Bell className="h-5 w-5" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full"
                  />
                </motion.button>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 bg-white/5 rounded-xl p-2 border border-white/10"
                >
                  <img
                    src={user?.picture || '/api/placeholder/32/32'}
                    alt={user?.name}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                  <div className="hidden sm:block">
                    <p className="text-white text-sm font-medium">{user?.name?.split(' ')[0]}</p>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-pink-400" />
                      <span className="text-emerald-300 text-xs">Online</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Built with Bolt.new Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
        >
          <Zap className="h-4 w-4" />
          <span>Built with Bolt.new</span>
          <Heart className="h-3 w-3" />
        </motion.a>
      </div>
    </div>
  );
};
import React, { ReactNode, useState, useEffect } from 'react';
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

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -320,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        }}
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] bg-gradient-to-b from-slate-800/98 to-slate-900/98 backdrop-blur-xl border-r border-white/10 lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10 min-h-[64px]">
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 lg:space-x-3"
            onClick={() => setSidebarOpen(false)}
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
          <motion.button
            onClick={() => setSidebarOpen(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* User Profile */}
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

        {/* Navigation */}
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
                onClick={() => setSidebarOpen(false)}
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

        {/* Sidebar Footer */}
        <div className="p-3 lg:p-4 border-t border-white/10 space-y-1 lg:space-y-2">
          <Link
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg lg:rounded-xl transition-all duration-300 group"
          >
            <Settings className="h-4 w-4 lg:h-5 lg:w-5 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
            <span className="text-sm lg:text-base">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 text-gray-300 hover:text-red-300 hover:bg-red-500/10 rounded-lg lg:rounded-xl transition-all duration-300 group"
          >
            <LogOut className="h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
            <span className="text-sm lg:text-base">Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        {/* Top Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
          <div className="px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
                <motion.button
                  onClick={() => setSidebarOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl lg:text-2xl font-bold text-white truncate">
                    {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-gray-300 text-xs lg:text-sm truncate hidden sm:block">
                    {navItems.find(item => item.path === location.pathname)?.description || 'Welcome back!'}
                  </p>
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

        {/* Page Content */}
        <main className="p-4 lg:p-6">
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
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Built with Bolt.new Badge */}
      <div className="fixed bottom-4 right-4 z-30">
        <motion.a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-1 lg:space-x-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-2 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
        >
          <Zap className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Built with Bolt.new</span>
          <span className="sm:hidden">Bolt.new</span>
          <Heart className="h-2 w-2 lg:h-3 lg:w-3 flex-shrink-0" />
        </motion.a>
      </div>
    </div>
  );
};
import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart } from 'lucide-react';

// Import new components
import { Header } from './layout/Header';
import { SidebarHeader } from './layout/SidebarHeader';
import { UserProfile } from './layout/UserProfile';
import { Sidebar } from './layout/Sidebar';
import { SidebarFooter } from './layout/SidebarFooter';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
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

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Home',
      description: 'Your dashboard overview'
    },
    { 
      path: '/browse', 
      label: 'Browse Properties',
      description: 'Discover amazing properties'
    },
    { 
      path: '/my-properties', 
      label: 'My Properties',
      description: 'Manage your portfolio'
    },
    { 
      path: '/buy-fraction', 
      label: 'Buy Fraction',
      description: 'Fractional ownership'
    },
    { 
      path: '/rent', 
      label: 'Rent Property',
      description: 'Find rental opportunities'
    },
    { 
      path: '/loan', 
      label: 'Loan Property',
      description: 'Property financing'
    },
    { 
      path: '/dao', 
      label: 'DAO Governance',
      description: 'Property voting & decisions'
    },
    { 
      path: '/deed-generator', 
      label: 'Deed Generator',
      description: 'AI-powered deed creation'
    },
    { 
      path: '/create-deed', 
      label: 'Create Deed',
      description: 'Generate new deeds'
    },
  ];

  const currentPage = navItems.find(item => item.path === location.pathname);

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
        <SidebarHeader 
          onClose={() => setSidebarOpen(false)}
          showCloseButton={true}
        />
        <UserProfile />
        <Sidebar onItemClick={() => setSidebarOpen(false)} />
        <SidebarFooter onItemClick={() => setSidebarOpen(false)} />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        <Header
          title={currentPage?.label || 'Dashboard'}
          description={currentPage?.description || 'Welcome back!'}
          onMenuClick={() => setSidebarOpen(true)}
        />

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
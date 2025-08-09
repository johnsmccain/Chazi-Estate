import React, { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu,
  Bell,
  Heart,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { navItems } from './navData';




interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex ">
      {/* Sidebar */}
      <motion.div
              initial={false}
              animate={{ 
                x: sidebarOpen ? 0 : 0,
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
              className={`fixed max-lg:hidden top-0 inset-y-0 left-0 z-50 h-screen scrollbar-w-thin scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300  overflow-y-scroll bg-linear-to-b from-slate-800/98 to-slate-900/98 backdrop-blur-xl border-r border-white/10 lg:translate-x-0 lg:static lg:inset-0`}
            >
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/>
      </motion.div>

            <motion.div
              initial={false}
              animate={{ 
                x: sidebarOpen ? 0 : -500,
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
              className={`fixed lg:hidden top-0 inset-y-0 left-0 z-50 h-screen overflow-y-scroll  bg-linescrollbar-w-8 scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-y-scrollar-to-b from-slate-800/98 to-slate-900/98 backdrop-blur-xl border-r border-white/10 lg:translate-x-0 lg:static lg:inset-0`}
            >
      <Sidebar/>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-scroll  bg-linescrollbar-w-8 scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-y-scrollar-to-b">
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

    </div>
  );
};




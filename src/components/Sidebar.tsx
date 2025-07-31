import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Building2, ChevronRight, LogOut, Settings, Sparkles, X } from "lucide-react";
import { navItems } from "./navData";
export const Sidebar = ({sidebarOpen, setSidebarOpen}: any) => {  
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const isActive = (path: string) => location.pathname === path;

  return (
          <>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black">
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
            onClick={() => setSidebarOpen(!sidebarOpen)}
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
        <nav className="flex-1 p-4 space-y-2 ">
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
      </>
  )
}
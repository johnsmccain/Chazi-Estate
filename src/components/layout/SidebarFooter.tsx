import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarFooterProps {
  onItemClick?: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ onItemClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onItemClick?.();
  };

  return (
    <div className="p-3 lg:p-4 border-t border-white/10 space-y-1 lg:space-y-2">
      <Link
        to="/settings"
        onClick={onItemClick}
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
  );
};
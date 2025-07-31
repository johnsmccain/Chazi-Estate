import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Shield, Zap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Mock Google OAuth login
  const handleGoogleLogin = () => {
    // In a real app, this would integrate with Google OAuth
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    };
    
    login(mockUser);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Building2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to DeedAI
            </h1>
            <p className="text-gray-300">
              Sign in to access your secure property management platform
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-900 py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-gray-100 transition-colors duration-300 mb-6"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fbbc05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#ea4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span>AI-powered assistance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-purple-400" />
              <span>Blockchain-secured deeds</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
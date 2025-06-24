import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Heart,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Your property deeds are secured on the Algorand blockchain, ensuring immutable ownership records.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Processing',
      description: 'Advanced AI agents guide you through the entire process with voice and video assistance.'
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access your property records from anywhere in the world with our decentralized platform.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6 lg:mb-8">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 lg:mb-6">
              Deed<span className="text-blue-400">AI</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
              The future of real estate ownership is here. Secure, verify, and manage your property deeds 
              with AI-powered blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                to="/explorer"
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Explore Deeds</span>
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 lg:mb-4 flex items-center justify-center space-x-2">
              <span>Why Choose DeedAI?</span>
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Revolutionary technology meets real estate to create the most secure and efficient 
              property management platform ever built.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 lg:p-8 hover:bg-white/20 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 lg:mb-4 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 lg:mb-4 flex items-center justify-center space-x-2">
              <span>How It Works</span>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400" />
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform guides you through every step of the process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              'Sign in with Google',
              'AI Voice Onboarding',
              'Upload Property Details',
              'Generate Blockchain Deed'
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 lg:mb-4 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                >
                  {index + 1}
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {step}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
              Ready to revolutionize your real estate experience?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 lg:mb-8 max-w-2xl mx-auto">
              Join thousands of property owners who trust DeedAI for secure, blockchain-verified ownership.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>Start Your Journey</span>
              <Heart className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Built with Bolt.new Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Built with Bolt.new</span>
          <span className="sm:hidden">Bolt</span>
        </a>
      </div>
    </div>
  );
};
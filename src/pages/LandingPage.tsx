import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <Building2 className="h-16 w-16 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Deed<span className="text-blue-400">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The future of real estate ownership is here. Secure, verify, and manage your property deeds 
              with AI-powered blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/explorer"
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Explore Deeds</span>
                <Globe className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose DeedAI?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Revolutionary technology meets real estate to create the most secure and efficient 
              property management platform ever built.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-blue-400 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform guides you through every step of the process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="text-center"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Built with Bolt.new Badge */}
      <div className="fixed bottom-4 right-4">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Zap className="h-4 w-4" />
          <span>Built with Bolt.new</span>
        </a>
      </div>
    </div>
  );
};
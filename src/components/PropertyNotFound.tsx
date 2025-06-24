import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Search,
  Heart
} from 'lucide-react';

export const PropertyNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <AlertTriangle className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-4">Property Not Found</h2>
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          The property you're looking for is not available for fractional investment, 
          or it may have been removed from our platform.
        </p>

        <div className="space-y-4">
          <motion.button
            onClick={() => navigate('/browse')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Browse Available Properties</span>
            <Heart className="h-4 w-4" />
          </motion.button>

          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white/10 border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </motion.button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>Need help? Contact our support team</p>
          <p className="text-emerald-400">support@deedai.com</p>
        </div>
      </motion.div>
    </div>
  );
};
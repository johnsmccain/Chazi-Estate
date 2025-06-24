import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Target, Brain, Zap, Sparkles } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      to: '/upload',
      title: 'Add Property',
      description: 'AI-guided deed creation',
      color: 'from-emerald-500 to-blue-600',
      icon: Plus
    },
    {
      to: '/browse',
      title: 'Smart Browse',
      description: 'AI-recommended properties',
      color: 'from-purple-500 to-pink-600',
      icon: Target
    },
    {
      to: '#',
      title: 'AI Advisor',
      description: 'Get personalized insights',
      color: 'from-amber-500 to-orange-600',
      icon: Brain
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl"
    >
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
        <Zap className="h-6 w-6 text-amber-400" />
        <span>AI-Powered Quick Actions</span>
        <Sparkles className="h-5 w-5 text-amber-400" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={action.to}
              className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${action.color} rounded-xl hover:shadow-2xl transition-all duration-300 group`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg">{action.title}</span>
                <p className="text-white/80 text-sm">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
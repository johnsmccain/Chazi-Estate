import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface StatsGridProps {
  stats: Stat[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
            <p className="text-emerald-400 text-xs font-medium">{stat.change}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
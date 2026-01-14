/**
 * Progress Overview Component
 * Shows English level, Fitness level, Streak, and Total Hours
 * Designed to motivate and show progress at a glance
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Clock, Target } from 'lucide-react';

const ProgressOverview = ({ progress }) => {
  if (!progress) return null;

  const cards = [
    {
      id: 'english',
      label: 'English Level',
      value: progress.englishLevelName || 'Intermediate (B1+)',
      progress: progress.englishLevel || 60,
      color: '#E91E63',
      icon: Target,
      bg: 'from-[#E91E63]/10 to-[#C2185B]/10',
      border: 'border-[#E91E63]/30'
    },
    {
      id: 'fitness',
      label: 'Fitness Level',
      value: progress.fitnessLevelName || 'Advanced Beginner',
      progress: progress.fitnessLevel || 70,
      color: '#D4AF37',
      icon: TrendingUp,
      bg: 'from-[#D4AF37]/10 to-[#E91E63]/10',
      border: 'border-[#D4AF37]/30'
    },
    {
      id: 'streak',
      label: 'Streak',
      value: `${progress.streak || 0} days`,
      progress: Math.min((progress.streak || 0) / 30 * 100, 100),
      color: '#FF6B35',
      icon: Flame,
      bg: 'from-[#FF6B35]/10 to-[#E91E63]/10',
      border: 'border-[#FF6B35]/30'
    },
    {
      id: 'hours',
      label: 'Total Hours',
      value: `${progress.totalHours || 0}h`,
      progress: Math.min((progress.totalHours || 0) / 100 * 100, 100),
      color: '#00BCD4',
      icon: Clock,
      bg: 'from-[#00BCD4]/10 to-[#E91E63]/10',
      border: 'border-[#00BCD4]/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-6 h-6" style={{ color: card.color }} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                {card.value}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${card.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: card.color }}
              />
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              {card.progress.toFixed(0)}% complete
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProgressOverview;

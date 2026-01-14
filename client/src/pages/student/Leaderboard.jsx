/**
 * Leaderboard Page
 * Top 1% Enhancement: Real-time leaderboards
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Leaderboard from '../../components/gamification/Leaderboard';
import { Trophy, Users, Calendar, Flame } from 'lucide-react';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const LeaderboardPage = () => {
  const [selectedType, setSelectedType] = useState('global');

  const types = [
    { id: 'global', label: 'Global', icon: Trophy },
    { id: 'weekly', label: 'Weekly', icon: Calendar },
    { id: 'monthly', label: 'Monthly', icon: Calendar },
    { id: 'friends', label: 'Friends', icon: Users }
  ];

  return (
    <StandardPage
      seoTitle="Leaderboards - So Fluent"
      seoDescription="Compete with learners worldwide and climb the ranks"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <Trophy className="w-16 h-16 text-[#D4AF37] mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            Leaderboards
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compete with learners worldwide and climb the ranks!
          </p>
        </motion.div>

        {/* Type Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {types.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedType === type.id
                    ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white shadow-lg shadow-[#E91E63]/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{type.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Leaderboard */}
        <Leaderboard type={selectedType} />
      </div>
    </StandardPage>
  );
};

export default LeaderboardPage;

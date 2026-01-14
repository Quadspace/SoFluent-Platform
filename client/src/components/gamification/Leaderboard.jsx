/**
 * Leaderboard Component
 * Top 1% Enhancement: Real-time leaderboards
 */

import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Flame
} from 'lucide-react';
import { LoadingSpinner, SkeletonLoader } from '../common/MicroAnimations';

const Leaderboard = ({ type = 'global', cohortId = null }) => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');

  useEffect(() => {
    fetchLeaderboard();
  }, [type, selectedPeriod, cohortId]);

  const fetchLeaderboard = async () => {
    try {
      const token = await getToken();
      if (token) {
        const params = new URLSearchParams({ period: selectedPeriod });
        if (cohortId) params.append('cohortId', cohortId);
        
        const response = await fetch(`${backendUrl}/api/leaderboard/${type}?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setLeaderboard(data.leaderboard || []);
            setUserRank(data.userRank);
          }
        }
      }
    } catch (error) {
      // Error fetching leaderboard - will retry on next fetch
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-[#D4AF37]" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-[#CD7F32]" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'global': return 'Global';
      case 'cohort': return 'Cohort';
      case 'friends': return 'Friends';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Leaderboard';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" color="cherry" />
          <p className="text-gray-400 mt-4">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#E91E63] flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{getTypeLabel()} Leaderboard</h3>
            <p className="text-sm text-gray-400">Compete with other learners</p>
          </div>
        </div>
        
        {type === 'global' && (
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
          >
            <option value="all-time">All Time</option>
            <option value="monthly">This Month</option>
            <option value="weekly">This Week</option>
          </select>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mb-2 border-2 border-gray-300">
              {leaderboard[1]?.imageUrl ? (
                <img src={leaderboard[1].imageUrl} alt={leaderboard[1].name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold">{leaderboard[1]?.name?.charAt(0) || '2'}</span>
              )}
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-center min-w-[120px]">
              <Medal className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-white text-sm font-semibold">{leaderboard[1]?.name}</p>
              <p className="text-gray-400 text-xs">{leaderboard[1]?.totalXP} XP</p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E91E63] flex items-center justify-center mb-2 border-4 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/50">
              {leaderboard[0]?.imageUrl ? (
                <img src={leaderboard[0].imageUrl} alt={leaderboard[0].name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xl">{leaderboard[0]?.name?.charAt(0) || '1'}</span>
              )}
            </div>
            <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#E91E63]/20 rounded-lg px-4 py-2 text-center min-w-[120px] border border-[#D4AF37]/30">
              <Trophy className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
              <p className="text-white font-bold">{leaderboard[0]?.name}</p>
              <p className="text-[#D4AF37] text-sm font-semibold">{leaderboard[0]?.totalXP} XP</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#8B4513] flex items-center justify-center mb-2 border-2 border-[#CD7F32]">
              {leaderboard[2]?.imageUrl ? (
                <img src={leaderboard[2].imageUrl} alt={leaderboard[2].name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold">{leaderboard[2]?.name?.charAt(0) || '3'}</span>
              )}
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-center min-w-[120px]">
              <Award className="w-5 h-5 text-[#CD7F32] mx-auto mb-1" />
              <p className="text-white text-sm font-semibold">{leaderboard[2]?.name}</p>
              <p className="text-gray-400 text-xs">{leaderboard[2]?.totalXP} XP</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="space-y-2">
        {leaderboard.slice(3).map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
              entry.isCurrentUser
                ? 'bg-gradient-to-r from-[#E91E63]/20 to-[#C2185B]/20 border-2 border-[#E91E63]'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="w-10 flex items-center justify-center">
              {getRankIcon(entry.rank)}
            </div>
            
            {entry.imageUrl ? (
              <img src={entry.imageUrl} alt={entry.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D4AF37] flex items-center justify-center text-white font-bold">
                {entry.name?.charAt(0) || 'U'}
              </div>
            )}
            
            <div className="flex-1">
              <p className={`font-semibold ${entry.isCurrentUser ? 'text-[#E91E63]' : 'text-white'}`}>
                {entry.name} {entry.isCurrentUser && '(You)'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {entry.totalXP} XP
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {entry.streak} day streak
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {entry.completedLessons} lessons
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Rank (if not in top 10) */}
      {userRank && userRank > 10 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#E91E63]/20 to-[#C2185B]/20 rounded-xl border-2 border-[#E91E63]">
            <span className="text-gray-400 font-bold">#{userRank}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D4AF37] flex items-center justify-center text-white font-bold">
              {user?.fullName?.charAt(0) || 'Y'}
            </div>
            <div className="flex-1">
              <p className="text-[#E91E63] font-semibold">You (Your rank: #{userRank})</p>
              <p className="text-gray-400 text-xs">Keep learning to climb the ranks!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

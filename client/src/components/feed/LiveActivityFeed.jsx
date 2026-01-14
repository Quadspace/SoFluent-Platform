/**
 * Live Activity Feed Component
 * Top 1% Enhancement: Real-time activity feed
 */

import React from 'react';
import { useRealtimeFeed } from '../../hooks/useRealtimeFeed';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trophy,
  Flame,
  BookOpen,
  CheckCircle,
  MessageCircle,
  Zap,
  Circle
} from 'lucide-react';

const LiveActivityFeed = ({ maxItems = 5 }) => {
  const { activities, activeUsers, connected } = useRealtimeFeed();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'lesson_completed': return BookOpen;
      case 'mission_completed': return CheckCircle;
      case 'streak': return Flame;
      case 'leaderboard': return Trophy;
      case 'post': return MessageCircle;
      case 'challenge': return Zap;
      default: return Circle;
    }
  };

  const getActivityMessage = (activity) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'achievement':
        return `${data.userName || 'Someone'} unlocked "${data.achievementName || 'an achievement'}"! 🏆`;
      case 'lesson_completed':
        return `${data.userName || 'Someone'} completed a lesson! 📚`;
      case 'mission_completed':
        return `${data.userName || 'Someone'} completed a mission! ✅`;
      case 'streak':
        return `${data.userName || 'Someone'} has a ${data.streak || 0} day streak! 🔥`;
      case 'leaderboard':
        return `${data.userName || 'Someone'} climbed to #${data.rank || '?'} on the leaderboard! 📈`;
      case 'post':
        return `${data.userName || 'Someone'} shared a post! 💬`;
      case 'challenge':
        return `${data.userName || 'Someone'} completed today's challenge! 🎯`;
      default:
        return `${data.userName || 'Someone'} did something awesome! 🎉`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <h3 className="text-lg font-bold text-white">Live Activity</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{activeUsers} active</span>
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.slice(0, maxItems).map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <motion.div
                key={`${activity.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{getActivityMessage(activity)}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            {connected ? 'No recent activity' : 'Connecting...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivityFeed;

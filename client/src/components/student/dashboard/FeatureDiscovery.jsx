/**
 * Feature Discovery Component
 * Quick access cards to all 9 breakthrough features
 * Drives engagement and feature discovery
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  Zap,
  Briefcase,
  MessageCircle,
  Volume2,
  BookOpen,
  Video,
  TrendingUp,
  Trophy,
  Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureDiscovery = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      id: 'ai-life-mirror',
      icon: Sparkles,
      title: t('dashboard.features.aiLifeMirror', 'AI Life Mirror'),
      description: t('dashboard.features.aiLifeMirrorDesc', 'Learn from YOUR Instagram'),
      color: 'from-[#D4AF37] to-[#E91E63]',
      path: '/ai-life-mirror'
    },
    {
      id: 'missions',
      icon: Target,
      title: t('dashboard.features.missions', 'Real-World Missions'),
      description: t('dashboard.features.missionsDesc', 'Complete challenges, earn XP'),
      color: 'from-[#4CAF50] to-[#45A049]',
      path: '/missions'
    },
    {
      id: 'workouts',
      icon: Zap,
      title: t('dashboard.features.workouts', 'Workout-to-Fluency'),
      description: t('dashboard.features.workoutsDesc', 'Get fit, get fluent'),
      color: 'from-[#E91E63] to-[#C2185B]',
      path: '/workouts'
    },
    {
      id: 'career',
      icon: Briefcase,
      title: t('dashboard.features.career', 'Career Accelerator'),
      description: t('dashboard.features.careerDesc', 'Master career English'),
      color: 'from-[#0077B5] to-[#006399]',
      path: '/career'
    },
    {
      id: 'conversation',
      icon: MessageCircle,
      title: t('dashboard.features.conversation', 'AI Conversation'),
      description: t('dashboard.features.conversationDesc', 'Practice 24/7'),
      color: 'from-[#E91E63] to-[#C2185B]',
      path: '/conversation'
    },
    {
      id: 'pronunciation',
      icon: Volume2,
      title: t('dashboard.features.pronunciation', 'Pronunciation Coach'),
      description: t('dashboard.features.pronunciationDesc', 'Perfect your accent'),
      color: 'from-[#D4AF37] to-[#E91E63]',
      path: '/pronunciation'
    },
    {
      id: 'study-buddy',
      icon: BookOpen,
      title: t('dashboard.features.studyBuddy', 'Smart Study Buddy'),
      description: t('dashboard.features.studyBuddyDesc', 'Never forget a word'),
      color: 'from-[#4CAF50] to-[#45A049]',
      path: '/study-buddy'
    },
    {
      id: 'success-story',
      icon: Video,
      title: t('dashboard.features.successStory', 'Success Story'),
      description: t('dashboard.features.successStoryDesc', 'Share your journey'),
      color: 'from-[#D4AF37] to-[#E91E63]',
      path: '/success-story'
    },
    {
      id: 'feed',
      icon: TrendingUp,
      title: t('dashboard.features.feed', 'Community Feed'),
      description: t('dashboard.features.feedDesc', 'Connect with learners'),
      color: 'from-[#E91E63] to-[#C2185B]',
      path: '/feed'
    },
    {
      id: 'leaderboard',
      icon: Trophy,
      title: t('dashboard.features.leaderboard', 'Leaderboard'),
      description: t('dashboard.features.leaderboardDesc', 'Compete and climb ranks'),
      color: 'from-[#D4AF37] to-[#E91E63]',
      path: '/leaderboard'
    },
    {
      id: 'study-groups',
      icon: Users,
      title: t('dashboard.features.studyGroups', 'Study Groups'),
      description: t('dashboard.features.studyGroupsDesc', 'Learn together'),
      color: 'from-[#4CAF50] to-[#45A049]',
      path: '/study-groups'
    },
    {
      id: 'skill-tree',
      icon: Target,
      title: t('dashboard.features.skillTree', 'Skill Tree'),
      description: t('dashboard.features.skillTreeDesc', 'Unlock your path'),
      color: 'from-[#0077B5] to-[#006399]',
      path: '/skill-tree'
    },
    {
      id: 'rewards-shop',
      icon: Sparkles,
      title: t('dashboard.features.rewardsShop', 'Rewards Shop'),
      description: t('dashboard.features.rewardsShopDesc', 'Spend your coins'),
      color: 'from-[#D4AF37] to-[#E91E63]',
      path: '/rewards-shop'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          {t('dashboard.features.title', 'Your Learning Tools')}
        </h3>
        <span className="text-xs text-gray-400">
          {t('dashboard.features.subtitle', '14 breakthrough features')}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(feature.path)}
              className={`group relative p-4 bg-gradient-to-br ${feature.color} rounded-xl hover:scale-105 transition-all border border-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-${feature.color.split(' ')[1]}/50`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-white text-xs font-bold leading-tight">
                    {feature.title}
                  </div>
                  <div className="text-white/70 text-[10px] mt-0.5">
                    {feature.description}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FeatureDiscovery;

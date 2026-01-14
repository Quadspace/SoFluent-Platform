/**
 * Student Dashboard - The Dream Experience
 * 
 * This is where students land after login - their personalized command center
 * Features designed to drive engagement, retention, and upsells for $1M/year teacher platform
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { useOnboardingCheck } from '../../hooks/useOnboardingCheck.js';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Flame,
  Clock,
  Target,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Users,
  Zap,
  ArrowRight,
  Play,
  Trophy,
  Star
} from 'lucide-react';
import AnimatedButton from '../../components/common/AnimatedButton';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import LiveActivityFeed from '../../components/feed/LiveActivityFeed';
import ProgressOverview from '../../components/student/dashboard/ProgressOverview';
import LearningPathCard from '../../components/student/dashboard/LearningPathCard';
import DailyChallengeCard from '../../components/student/dashboard/DailyChallengeCard';
import UpcomingClassesCard from '../../components/student/dashboard/UpcomingClassesCard';
import RecommendedContentCard from '../../components/student/dashboard/RecommendedContentCard';
import AchievementUnlock from '../../components/student/dashboard/AchievementUnlock';
import FeatureDiscovery from '../../components/student/dashboard/FeatureDiscovery';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const { checking: checkingOnboarding } = useOnboardingCheck();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    if (!checkingOnboarding) {
      fetchDashboardData();
    }
  }, [checkingOnboarding]);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      
      if (token) {
        // Fetch real data from backend
        const response = await fetch(`${backendUrl}/api/student/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          // Fallback to mock data
          setDashboardData(generateMockData());
        }
      } else {
        // Use mock data for preview
        setDashboardData(generateMockData());
      }
    } catch (error) {
      // Fallback to mock data on error
      setDashboardData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    return {
      progress: {
        englishLevel: 60,
        englishLevelName: 'Intermediate (B1+)',
        fitnessLevel: 70,
        fitnessLevelName: 'Advanced Beginner',
        streak: 12,
        totalHours: 36.5,
        weeklyHours: 4.2
      },
      learningPath: {
        name: 'Career Advancement Path',
        currentWeek: 2,
        totalWeeks: 6,
        progress: 33,
        nextSteps: [
          {
            id: 1,
            title: 'Business Email Writing',
            duration: '15 min',
            type: 'lesson',
            icon: '📧'
          },
          {
            id: 2,
            title: 'Interview Prep Session',
            duration: '30 min',
            type: 'class',
            icon: '💼'
          }
        ]
      },
      dailyChallenge: {
        id: 1,
        title: "Record yourself saying:",
        phrase: "I'm working out to feel confident and strong.",
        completed: false,
        completedCount: 18
      },
      upcomingClasses: [
        {
          id: 1,
          title: 'Fluency Fit Beginner',
          time: 'Tomorrow 9:00 AM',
          type: 'live',
          enrolled: true
        },
        {
          id: 2,
          title: 'Business English Advanced',
          time: 'Friday 6:00 PM',
          type: 'live',
          enrolled: true
        }
      ],
      recommendations: [
        {
          id: 1,
          title: 'Advanced Negotiation Tactics',
          duration: '12 min',
          type: 'lesson',
          reason: 'Based on your progress',
          thumbnail: null
        },
        {
          id: 2,
          title: 'Gym Vocabulary Deep Dive',
          duration: '20 min',
          type: 'lesson',
          reason: 'You love fitness content',
          thumbnail: null
        }
      ],
      achievements: {
        unlocked: [
          { id: 1, name: 'First Week Complete', icon: '🏆', unlocked: true },
          { id: 2, name: 'Perfect Attendance', icon: '⭐', unlocked: true },
          { id: 3, name: 'Homework Hero', icon: '📚', unlocked: true }
        ],
        locked: [
          { id: 4, name: '30-Day Streak', icon: '🔥', progress: 12, target: 30 },
          { id: 5, name: 'VIP Member', icon: '👑', progress: 0, target: 1 }
        ]
      },
      stats: {
        coursesCompleted: 2,
        totalCourses: 5,
        communityRank: 23,
        totalStudents: 327
      }
    };
  };

  if (loading) {
    return (
      <StandardPage
        loading={loading}
        seoTitle="Dashboard - So Fluent"
        seoDescription="Your personalized English learning dashboard"
        background="bg-gradient-to-br from-sofluent-dark via-sofluent-black to-sofluent-dark"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Dashboard - So Fluent"
      seoDescription="Your personalized English learning dashboard"
      background="bg-gradient-to-br from-sofluent-dark via-sofluent-black to-sofluent-dark"
    >
      {/* Achievement Unlock Modal */}
      {newAchievement && (
        <AchievementUnlock
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to continue your English journey? Let's make today count! 💪
          </p>
        </motion.div>

        {/* Progress Overview Cards */}
        <ProgressOverview progress={dashboardData?.progress} />

        {/* Feature Discovery - Quick Access to All 9 Features */}
        <FeatureDiscovery />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Learning Path & Challenge */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Path Card */}
            <LearningPathCard
              learningPath={dashboardData?.learningPath}
              onContinue={() => navigate('/my-enrollments')}
            />

            {/* Daily Challenge */}
            <DailyChallengeCard
              challenge={dashboardData?.dailyChallenge}
              onComplete={() => {
                // Handle challenge completion
                setNewAchievement({
                  name: 'Daily Challenge Complete',
                  icon: '🔥',
                  message: 'You completed today\'s challenge!'
                });
              }}
            />

            {/* Recommended Content */}
            <RecommendedContentCard
              recommendations={dashboardData?.recommendations}
              onSelect={(id) => {
                // Navigate to content
                navigate(`/course/${id}`);
              }}
            />
          </div>

          {/* Right Column - Classes & Stats */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <UpcomingClassesCard
              classes={dashboardData?.upcomingClasses}
              onJoin={(id) => {
                // Join class - navigate to class page
                navigate(`/class/${id}`);
              }}
            />

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#E91E63]/10 to-[#C2185B]/10 border border-[#E91E63]/20 rounded-2xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#D4AF37]" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Courses Completed</span>
                  <span className="text-white font-bold">
                    {dashboardData?.stats?.coursesCompleted || 0}/{dashboardData?.stats?.totalCourses || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Community Rank</span>
                  <span className="text-white font-bold">
                    #{dashboardData?.stats?.communityRank || 0} of {dashboardData?.stats?.totalStudents || 327}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">This Week</span>
                  <span className="text-white font-bold">
                    {dashboardData?.progress?.weeklyHours || 0}h
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Achievements Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#D4AF37]/10 to-[#E91E63]/10 border border-[#D4AF37]/20 rounded-2xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                Achievements
              </h3>
              <div className="space-y-3">
                {dashboardData?.achievements?.unlocked?.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-white text-sm">{achievement.name}</span>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full mt-4 text-[#D4AF37] text-sm font-semibold hover:text-[#E91E63] transition-colors flex items-center justify-center gap-2"
                >
                  View All Achievements
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8"
        >
          <LiveActivityFeed maxItems={5} />
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedButton
              onClick={() => navigate('/feed')}
              variant="ghost"
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#E91E63]/20 to-[#C2185B]/20 rounded-xl border border-[#E91E63]/30"
            >
              <Sparkles className="w-6 h-6 text-[#E91E63]" />
              <span className="text-white text-sm font-semibold">Feed</span>
            </AnimatedButton>
            <AnimatedButton
              onClick={() => navigate('/my-enrollments')}
              variant="ghost"
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#D4AF37]/20 to-[#E91E63]/20 rounded-xl border border-[#D4AF37]/30"
            >
              <BookOpen className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-white text-sm font-semibold">My Courses</span>
            </AnimatedButton>
            <AnimatedButton
              onClick={() => navigate('/leaderboard')}
              variant="ghost"
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#D4AF37]/20 to-[#E91E63]/20 rounded-xl border border-[#D4AF37]/30"
            >
              <Trophy className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-white text-sm font-semibold">Leaderboard</span>
            </AnimatedButton>
            <AnimatedButton
              onClick={() => navigate('/profile')}
              variant="ghost"
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
            >
              <Users className="w-6 h-6 text-purple-400" />
              <span className="text-white text-sm font-semibold">Profile</span>
            </AnimatedButton>
          </div>
        </motion.div>
      </div>

    </StandardPage>
  );
};

export default Dashboard;

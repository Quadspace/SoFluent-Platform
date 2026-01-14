/**
 * Student Profile Page
 * Personal space for students to see their progress, achievements, and settings
 * Key for retention and engagement
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import InstagramConnect from '../../components/instagram/InstagramConnect';
import { motion } from 'framer-motion';
import {
  Award,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Flame,
  Edit,
  Settings,
  Instagram,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  Lock
} from 'lucide-react';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await getToken();
      
      if (token) {
        // Fetch real data
        const [dashboardRes, progressRes, achievementsRes] = await Promise.all([
          fetch(`${backendUrl}/api/student/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${backendUrl}/api/student/progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${backendUrl}/api/student/achievements`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (dashboardRes.ok && progressRes.ok && achievementsRes.ok) {
          const dashboard = await dashboardRes.json();
          const progress = await progressRes.json();
          const achievements = await achievementsRes.json();
          
          setProfileData({
            progress: progress.progress || dashboard.dashboard?.progress,
            achievements: achievements.achievements || dashboard.dashboard?.achievements,
            stats: dashboard.dashboard?.stats
          });
        } else {
          setProfileData(generateMockData());
        }
      } else {
        setProfileData(generateMockData());
      }
    } catch (error) {
      // Fallback to mock data on error
      setProfileData(generateMockData());
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
      achievements: {
        unlocked: [
          { id: 1, name: 'First Week Complete', icon: '🏆', unlocked: true, unlockedAt: '2026-01-08' },
          { id: 2, name: 'Perfect Attendance', icon: '⭐', unlocked: true, unlockedAt: '2026-01-10' },
          { id: 3, name: 'Homework Hero', icon: '📚', unlocked: true, unlockedAt: '2026-01-12' },
          { id: 4, name: 'Community Star', icon: '👥', unlocked: true, unlockedAt: '2026-01-14' },
          { id: 5, name: 'Workout Warrior', icon: '💪', unlocked: true, unlockedAt: '2026-01-15' }
        ],
        locked: [
          { id: 6, name: '30-Day Streak', icon: '🔥', progress: 12, target: 30 },
          { id: 7, name: 'VIP Member', icon: '👑', progress: 0, target: 1 },
          { id: 8, name: 'Fluent Speaker', icon: '🎯', progress: 60, target: 100 }
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
        loading={true}
        seoTitle="My Profile - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="My Profile - So Fluent"
      seoDescription="View your progress, achievements, and settings"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              My Profile
            </h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all">
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
          
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D4AF37] flex items-center justify-center text-3xl font-bold text-white">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user?.fullName || 'Student'}
                </h2>
                <p className="text-gray-400 mb-2">{user?.primaryEmailAddress?.emailAddress || 'student@email.com'}</p>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-[#E91E63]/20 border border-[#E91E63]/30 rounded-full text-[#E91E63] text-sm font-semibold">
                    Academy Plan - R$297/mo
                  </span>
                  <button className="text-[#E91E63] text-sm font-semibold hover:text-[#C2185B] transition-colors flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'courses', label: 'My Courses', icon: BookOpen },
            { id: 'instagram', label: 'Instagram', icon: Instagram }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#E91E63] text-[#E91E63]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <OverviewTab progress={profileData?.progress} stats={profileData?.stats} />
          )}
          
          {activeTab === 'achievements' && (
            <AchievementsTab achievements={profileData?.achievements} />
          )}
          
          {activeTab === 'courses' && (
            <CoursesTab onViewCourses={() => navigate('/my-enrollments')} />
          )}
          
          {activeTab === 'instagram' && (
            <InstagramTab />
          )}
        </div>
      </div>

      <Footer />
    </StandardPage>
  );
};

// Overview Tab Component
const OverviewTab = ({ progress, stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#E91E63]" />
          Your Progress
        </h3>
        
        <div className="space-y-6">
          {/* English Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">English Level</span>
              <span className="text-white font-bold">{progress?.englishLevelName}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress?.englishLevel || 0}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] rounded-full"
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">{progress?.englishLevel || 0}% complete</div>
          </div>

          {/* Fitness Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Fitness Level</span>
              <span className="text-white font-bold">{progress?.fitnessLevelName}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress?.fitnessLevel || 0}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E91E63] rounded-full"
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">{progress?.fitnessLevel || 0}% complete</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div className="text-2xl font-black text-white">{progress?.streak || 0}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-5 h-5 text-[#00BCD4]" />
              </div>
              <div className="text-2xl font-black text-white">{progress?.totalHours || 0}h</div>
              <div className="text-xs text-gray-400">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-black text-white">#{stats?.communityRank || 0}</div>
              <div className="text-xs text-gray-400">Rank</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-[#D4AF37]" />
          Your Stats
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <span className="text-gray-300">Courses Completed</span>
            <span className="text-white font-bold">
              {stats?.coursesCompleted || 0}/{stats?.totalCourses || 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <span className="text-gray-300">This Week</span>
            <span className="text-white font-bold">{progress?.weeklyHours || 0}h</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <span className="text-gray-300">Community Rank</span>
            <span className="text-white font-bold">
              #{stats?.communityRank || 0} of {stats?.totalStudents || 327}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Achievements Tab Component
const AchievementsTab = ({ achievements }) => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Your Achievements</h3>
        <p className="text-gray-400">
          {achievements?.unlocked?.length || 0} unlocked • {achievements?.locked?.length || 0} locked
        </p>
      </div>

      {/* Unlocked Achievements */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
          Unlocked ({achievements?.unlocked?.length || 0})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements?.unlocked?.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-[#D4AF37]/20 to-[#E91E63]/20 border border-[#D4AF37]/30 rounded-xl p-6 text-center"
            >
              <div className="text-5xl mb-3">{achievement.icon}</div>
              <div className="text-white font-semibold mb-1">{achievement.name}</div>
              {achievement.unlockedAt && (
                <div className="text-xs text-gray-400">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Achievements */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-400" />
          Locked ({achievements?.locked?.length || 0})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements?.locked?.map((achievement) => {
            const progressPercent = (achievement.progress / achievement.target) * 100;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center opacity-60"
              >
                <div className="text-5xl mb-3 grayscale">{achievement.icon}</div>
                <div className="text-white font-semibold mb-2">{achievement.name}</div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#E91E63] to-[#D4AF37] rounded-full"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {achievement.progress}/{achievement.target}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Courses Tab Component
const CoursesTab = ({ onViewCourses }) => {
  return (
    <div className="text-center py-12">
      <BookOpen className="w-16 h-16 text-[#E91E63] mx-auto mb-4 opacity-50" />
      <h3 className="text-2xl font-bold text-white mb-2">Your Courses</h3>
      <p className="text-gray-400 mb-6">View and manage all your enrolled courses</p>
      <button
        onClick={onViewCourses}
        className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all"
      >
        View My Courses
      </button>
    </div>
  );
};

// Instagram Tab Component
const InstagramTab = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkInstagramStatus();
  }, []);

  const checkInstagramStatus = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/user/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setConnected(data.user?.instagramConnect || false);
        }
      }
    } catch (error) {
      // Handle Instagram status check error silently
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    // This will trigger OAuth flow
    setConnected(true);
    // The actual OAuth happens in InstagramConnect component
  };

  const handleDisconnect = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/instagram/disconnect`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setConnected(false);
        }
      }
    } catch (error) {
      // Handle Instagram disconnect error silently
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <InstagramConnect
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        connected={connected}
        backendUrl={backendUrl}
        getToken={getToken}
      />
    </div>
  );
};

export default Profile;

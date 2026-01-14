/**
 * Teacher Admin Dashboard
 * 3-Tier Platform: Level 2 - Teacher Admin Panel
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  DollarSign,
  Star,
  Calendar,
  TrendingUp,
  Clock,
  BookOpen
} from 'lucide-react';
import StandardPage from '../../utils/pageConsistency';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/teacher/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDashboardData(data.dashboard);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty dashboard data
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Teacher Dashboard - So Fluent"
        background="bg-gradient-to-br from-sofluent-black via-sofluent-dark to-sofluent-black"
      />
    );
  }

  const metrics = dashboardData?.metrics || {
    students: 0,
    activeStudents: 0,
    classes: 0,
    earnings: 0,
    averageRating: 0,
    attendance: 0
  };

  return (
    <StandardPage
      seoTitle="Teacher Dashboard - So Fluent"
      seoDescription="Teacher dashboard for managing classes and students"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      showNavbar={false}
      showFooter={false}
    >
    <div className="p-8">
      {/* Header */}
      <div className="bg-sofluent-dark/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              Teacher Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, {user?.fullName || 'Teacher'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={Users}
            label="My Students"
            value={metrics.students}
            change={`${metrics.activeStudents} active`}
            color="from-sofluent-cherry to-sofluent-cherry-dark"
          />
          <MetricCard
            icon={GraduationCap}
            label="My Classes"
            value={metrics.classes}
            change="This month"
            color="from-green-500 to-green-600"
          />
          <MetricCard
            icon={DollarSign}
            label="My Earnings"
            value={`R$ ${metrics.earnings.toLocaleString('pt-BR')}`}
            change="This month"
            color="from-sofluent-gold to-sofluent-cherry"
          />
          <MetricCard
            icon={Star}
            label="Avg Rating"
            value={metrics.averageRating.toFixed(1)}
            change="⭐"
            color="from-blue-600 to-blue-700"
          />
          <MetricCard
            icon={TrendingUp}
            label="Attendance"
            value={`${metrics.attendance}%`}
            change="+3% ↑"
            color="from-sofluent-cherry to-sofluent-cherry-dark"
          />
          <MetricCard
            icon={BookOpen}
            label="Completion"
            value="87%"
            change="+5% ↑"
            color="from-green-500 to-green-600"
          />
        </div>

        {/* Upcoming Classes */}
        {dashboardData?.upcomingClasses && dashboardData.upcomingClasses.length > 0 && (
          <div className="bg-gradient-to-br from-sofluent-dark to-sofluent-black border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sofluent-cherry" />
              Upcoming Classes
            </h2>
            <div className="space-y-4">
              {dashboardData.upcomingClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{classItem.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(classItem.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{classItem.enrolledStudents?.length || 0} enrolled</span>
                        </div>
                      </div>
                    </div>
                    <BrandButton variant="primary" size="small">
                      Start Class
                    </BrandButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="View My Students"
            description="Manage your assigned students"
            onClick={() => navigate('/teacher/students')}
            color="from-sofluent-cherry to-sofluent-cherry-dark"
          />
          <ActionCard
            title="Upload Content"
            description="Add videos and lessons"
            onClick={() => navigate('/teacher/content')}
            color="from-green-500 to-green-600"
          />
          <ActionCard
            title="My Earnings"
            description="View earnings history"
            onClick={() => navigate('/teacher/earnings')}
            color="from-sofluent-gold to-sofluent-cherry"
          />
        </div>
      </div>
    </div>
    </StandardPage>
  );
};

const MetricCard = ({ icon: Icon, label, value, change, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 border border-white/10`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {change && (
          <p className="text-white/60 text-xs mt-1">{change}</p>
        )}
      </div>
    </motion.div>
  );
};

const ActionCard = ({ title, description, onClick, color }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all text-left`}
    >
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </motion.button>
  );
};

export default TeacherDashboard;

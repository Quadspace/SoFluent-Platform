/**
 * Master Admin Dashboard
 * 3-Tier Platform: Level 1 - Master Admin Dashboard
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  BarChart3,
  AlertCircle,
  Plus,
  FileText,
  Settings
} from 'lucide-react';
import StandardPage from '../../utils/pageConsistency';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const MasterAdminDashboard = () => {
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
        const response = await fetch(`${backendUrl}/api/admin/dashboard`, {
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
        seoTitle="Master Admin Dashboard - So Fluent"
        background="bg-gradient-to-br from-sofluent-black via-sofluent-dark to-sofluent-black"
      />
    );
  }

  const metrics = dashboardData?.metrics || {
    revenue: 0,
    students: 0,
    teachers: 0,
    profit: 0,
    mrr: 0,
    churn: 0
  };

  return (
    <StandardPage
      seoTitle="Master Admin Dashboard - So Fluent"
      seoDescription="Master admin dashboard for platform management"
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
              Master Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, {user?.fullName || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={DollarSign}
            label="Revenue"
            value={`R$ ${metrics.revenue.toLocaleString('pt-BR')}`}
            change={`+${dashboardData?.revenueGrowth || 15}%`}
            positive={true}
            color="from-sofluent-gold to-sofluent-cherry"
          />
          <MetricCard
            icon={Users}
            label="Students"
            value={metrics.students.toLocaleString()}
            change={`+${dashboardData?.studentGrowth || 23}`}
            positive={true}
            color="from-sofluent-cherry to-sofluent-cherry-dark"
          />
          <MetricCard
            icon={GraduationCap}
            label="Teachers"
            value={metrics.teachers}
            change={`+${dashboardData?.teacherGrowth || 2}`}
            positive={true}
            color="from-green-500 to-green-600"
          />
          <MetricCard
            icon={TrendingUp}
            label="Profit"
            value={`R$ ${metrics.profit.toLocaleString('pt-BR')}`}
            change={`${dashboardData?.profitMargin?.toFixed(1) || 88}% margin`}
            positive={true}
            color="from-sofluent-gold to-sofluent-cherry"
          />
          <MetricCard
            icon={BarChart3}
            label="MRR"
            value={`R$ ${metrics.mrr.toLocaleString('pt-BR')}`}
            change={`+${dashboardData?.revenueGrowth || 15}%`}
            positive={true}
            color="from-blue-600 to-blue-700"
          />
          <MetricCard
            icon={AlertCircle}
            label="Churn Rate"
            value={`${metrics.churn.toFixed(1)}%`}
            change={`-0.3%`}
            positive={true}
            color="from-sofluent-cherry to-sofluent-cherry-dark"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-sofluent-dark to-sofluent-black border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionButton
              icon={Plus}
              label="New Cohort"
              onClick={() => navigate('/admin/cohorts/new')}
              color="from-sofluent-cherry to-sofluent-cherry-dark"
            />
            <ActionButton
              icon={Users}
              label="Add Teacher"
              onClick={() => navigate('/admin/teachers/new')}
              color="from-green-500 to-green-600"
            />
            <ActionButton
              icon={Users}
              label="Add Student"
              onClick={() => navigate('/admin/students/new')}
              color="from-blue-600 to-blue-700"
            />
            <ActionButton
              icon={FileText}
              label="View Reports"
              onClick={() => navigate('/admin/financials')}
              color="from-sofluent-gold to-sofluent-cherry"
            />
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-gradient-to-br from-sofluent-dark to-sofluent-black border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Revenue Chart (Last 12 Months)</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart component will be added with recharts
          </div>
        </div>
      </div>
    </div>
    </StandardPage>
  );
};

const MetricCard = ({ icon: Icon, label, value, change, positive, color }) => {
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
        <span className={`text-xs font-semibold ${positive ? 'text-green-300' : 'text-red-300'}`}>
          {change} ↑
        </span>
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick, color }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all`}
    >
      <Icon className="w-6 h-6 text-white mb-2" />
      <p className="text-white text-sm font-semibold">{label}</p>
    </motion.button>
  );
};

export default MasterAdminDashboard;

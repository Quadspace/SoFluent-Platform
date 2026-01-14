/**
 * Workouts Page
 * Feature 2: Workout-to-Fluency™
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { Calendar, Clock, Users, Play, Video, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

// Component definitions - must be before Workouts component
const ClassCard = ({ classItem, onJoin }) => {
  const { t } = useTranslation();
  const canJoin = classItem.timeUntil?.includes('min') || classItem.timeUntil === 'Now';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-2 rounded-2xl p-6 transition-all ${
        canJoin ? 'border-[#4CAF50] shadow-lg shadow-[#4CAF50]/20' : 'border-white/10'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="px-3 py-1 bg-[#E91E63]/20 text-[#E91E63] rounded-full text-xs font-semibold uppercase">
          {classItem.type}
        </span>
        <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-xs">
          {classItem.level}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{classItem.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{classItem.description}</p>

      <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{classItem.duration || 45} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{classItem.enrolledCount}/{classItem.maxStudents}</span>
        </div>
      </div>

      <div className="text-white font-semibold mb-4">
        {classItem.time}
      </div>

      <button
        onClick={onJoin}
        disabled={!canJoin}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          canJoin
            ? 'bg-gradient-to-r from-[#4CAF50] to-[#45A049] text-white hover:shadow-lg hover:shadow-[#4CAF50]/50'
            : 'bg-white/5 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canJoin ? (
          <>
            <Play className="w-5 h-5 inline mr-2" />
            {t('workouts.joinNow', 'Join Now')}
          </>
        ) : (
          classItem.timeUntil || t('workouts.startsIn', 'Starts soon')
        )}
      </button>
    </motion.div>
  );
};

const RecordedClassCard = ({ classItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#E91E63] transition-all group"
    >
      <div className="aspect-video bg-white/5 relative">
        <Video className="w-12 h-12 text-white/50 absolute inset-0 m-auto group-hover:text-[#E91E63] transition-colors" />
      </div>
      <div className="p-4">
        <h4 className="text-white font-bold mb-1 line-clamp-1">{classItem.title}</h4>
        <p className="text-gray-400 text-xs">{classItem.time}</p>
      </div>
    </motion.div>
  );
};

const Workouts = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/classes/upcoming`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUpcomingClasses(data.classes || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty classes array
    } finally {
      setLoading(false);
    }
  };

  const joinClass = (meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Workouts - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Workouts - So Fluent"
      seoDescription="Join live fitness classes while learning English"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
    >
      <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <Zap className="w-16 h-16 text-[#E91E63] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('workouts.title', 'Workout-to-Fluency™')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            {t('workouts.subtitle', 'Get Fit. Get Fluent. Transform Your Life.')}
          </p>
          <div className="inline-flex items-center gap-2 bg-[#4CAF50]/20 border border-[#4CAF50]/30 rounded-full px-4 py-2">
            <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
            <span className="text-[#4CAF50] font-semibold">
              {t('workouts.scienceBacked', '🧠 Science-Backed: 20-40% Faster Learning')}
            </span>
          </div>
        </div>

        {/* Upcoming Classes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('workouts.upcomingClasses', 'Upcoming Live Classes')}
          </h2>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  onJoin={() => joinClass(classItem.meetingLink)}
                />
              ))}
            </div>
          )}
        </section>

        {/* On-Demand Library */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {t('workouts.onDemand', 'On-Demand Workouts')}
            </h2>
            <div className="flex gap-2">
              {['all', 'hiit', 'yoga', 'strength'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    filter === type
                      ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {t(`workouts.${type}`, type.charAt(0).toUpperCase() + type.slice(1))}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastClasses
              .filter(c => filter === 'all' || c.type === filter)
              .map((classItem) => (
                <RecordedClassCard key={classItem.id} classItem={classItem} />
              ))}
          </div>
        </section>
      </div>
      </div>
    </StandardPage>
  );
};

export default Workouts;

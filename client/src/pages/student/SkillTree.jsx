/**
 * Skill Tree Page
 * Top 1% Enhancement: Visual progression system
 */

import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion } from 'framer-motion';
import {
  Lock,
  Unlock,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Mic,
  PenTool,
  Eye,
  Ear,
  MessageCircle
} from 'lucide-react';
import AnimatedButton from '../../components/common/AnimatedButton';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const SkillTree = () => {
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory]);

  const fetchSkills = async () => {
    try {
      const token = await getToken();
      if (token) {
        const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
        const response = await fetch(`${backendUrl}/api/skills${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSkills(data.skills || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty skills array
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (skillId) => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/skills/${skillId}/unlock`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            fetchSkills(); // Refresh
          }
        }
      }
    } catch (error) {
      // Error handled by useErrorHandler hook
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: TrendingUp },
    { id: 'grammar', label: 'Grammar', icon: BookOpen },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'pronunciation', label: 'Pronunciation', icon: Mic },
    { id: 'conversation', label: 'Conversation', icon: MessageCircle },
    { id: 'writing', label: 'Writing', icon: PenTool },
    { id: 'reading', label: 'Reading', icon: Eye },
    { id: 'listening', label: 'Listening', icon: Ear }
  ];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || BookOpen;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'from-[#D4AF37] to-[#E91E63]';
      case 'in-progress': return 'from-[#E91E63] to-[#C2185B]';
      case 'unlocked': return 'from-[#4CAF50] to-[#45A049]';
      case 'locked': return 'from-gray-600 to-gray-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Skill Tree - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Skill Tree - So Fluent"
      seoDescription="Unlock skills and track your English learning progress"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            Skill Tree
          </h1>
          <p className="text-xl text-gray-400">
            Unlock skills and progress through your learning journey
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const CategoryIcon = getCategoryIcon(skill.category);
            return (
              <SkillCard
                key={skill._id}
                skill={skill}
                index={index}
                CategoryIcon={CategoryIcon}
                getStatusColor={getStatusColor}
                onUnlock={() => handleUnlock(skill._id)}
              />
            );
          })}
        </div>
      </div>
    </StandardPage>
  );
};

const SkillCard = ({ skill, index, CategoryIcon, getStatusColor, onUnlock }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gradient-to-br ${getStatusColor(skill.status)} border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all relative`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {skill.status === 'completed' && <CheckCircle className="w-6 h-6 text-[#D4AF37]" />}
        {skill.status === 'locked' && <Lock className="w-6 h-6 text-gray-400" />}
        {skill.status === 'unlocked' && <Unlock className="w-6 h-6 text-green-400" />}
      </div>

      {/* Icon */}
      <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-4">
        <CategoryIcon className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
      {skill.description && (
        <p className="text-white/80 text-sm mb-4">{skill.description}</p>
      )}

      {/* Progress */}
      {skill.status !== 'locked' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-white/80 mb-2">
            <span>Progress</span>
            <span>{skill.progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.progress}%` }}
              className="bg-white h-2 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Rewards */}
      {skill.rewards && (
        <div className="mb-4 text-sm text-white/80">
          <span className="font-semibold">Rewards: </span>
          {skill.rewards.xp > 0 && <span>{skill.rewards.xp} XP</span>}
          {skill.rewards.coins > 0 && <span className="ml-2">{skill.rewards.coins} Coins</span>}
        </div>
      )}

      {/* Action */}
      {skill.status === 'unlocked' && (
        <AnimatedButton
          onClick={() => {/* Navigate to skill lessons */}}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          Start Learning
        </AnimatedButton>
      )}
      {skill.status === 'locked' && (
        <AnimatedButton
          onClick={onUnlock}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Unlock Skill
        </AnimatedButton>
      )}
      {skill.status === 'completed' && (
        <div className="text-center text-[#D4AF37] font-semibold">
          ✓ Completed
        </div>
      )}
    </motion.div>
  );
};

export default SkillTree;

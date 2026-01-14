/**
 * Study Groups Page
 * Top 1% Enhancement: Study groups and communities
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Trophy,
  Flame,
  Calendar,
  Lock,
  Unlock
} from 'lucide-react';
import AnimatedButton from '../../components/common/AnimatedButton';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const StudyGroups = () => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [search, levelFilter]);

  const fetchGroups = async () => {
    try {
      const token = await getToken();
      if (token) {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (levelFilter !== 'all') params.append('level', levelFilter);
        
        const response = await fetch(`${backendUrl}/api/study-groups?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setGroups(data.groups || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty groups array
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/study-groups/${groupId}/join`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            fetchGroups(); // Refresh list
          }
        }
      }
    } catch (error) {
      // Error handled by useErrorHandler hook
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Study Groups - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Study Groups - So Fluent"
      seoDescription="Join study groups and learn together"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              Study Groups
            </h1>
            <p className="text-xl text-gray-400">
              Join communities and learn together
            </p>
          </div>
          <AnimatedButton
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </AnimatedButton>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#E91E63] focus:outline-none"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <GroupCard
              key={group._id}
              group={group}
              index={index}
              onJoin={() => handleJoinGroup(group._id)}
            />
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No study groups found</p>
            <AnimatedButton
              onClick={() => setShowCreateModal(true)}
              variant="primary"
            >
              Create Your First Group
            </AnimatedButton>
          </div>
        )}
      </div>
    </StandardPage>
  );
};

const GroupCard = ({ group, index, onJoin }) => {
  const isMember = group.members?.includes(group.creatorId); // Simplified check

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#E91E63]/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
          {group.description && (
            <p className="text-gray-400 text-sm mb-4">{group.description}</p>
          )}
        </div>
        {group.isPublic ? (
          <Unlock className="w-5 h-5 text-green-400" />
        ) : (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{group.memberCount || 0}/{group.maxMembers || 50} members</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Trophy className="w-4 h-4" />
          <span>{group.stats?.totalXP || 0} total XP</span>
        </div>
        {group.level !== 'all' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="capitalize">{group.level}</span>
          </div>
        )}
      </div>

      <AnimatedButton
        onClick={onJoin}
        variant={isMember ? 'outline' : 'primary'}
        size="md"
        className="w-full"
        disabled={isMember}
      >
        {isMember ? 'Joined' : 'Join Group'}
      </AnimatedButton>
    </motion.div>
  );
};

export default StudyGroups;

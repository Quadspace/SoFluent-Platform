/**
 * Cohort Management
 * 3-Tier Platform: Drag-and-drop cohort management
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion } from 'framer-motion';
import {
  Plus,
  Filter,
  Search,
  Users,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  MoreVertical,
  Grid3x3,
  LayoutGrid
} from 'lucide-react';
import StandardPage from '../../utils/pageConsistency';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import BrandButton from '../../components/common/BrandButton';
import CohortCanvas from '../../components/admin/CohortCanvas';

// CohortCard component - must be defined before CohortManagement component
const CohortCard = ({ cohort, getStatusColor, onEdit, onView }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      className="bg-gradient-to-br from-sofluent-dark to-sofluent-black border border-white/10 rounded-2xl p-6 hover:border-sofluent-cherry/50 transition-all cursor-pointer relative"
      style={{ borderColor: cohort.color || 'var(--sofluent-cherry)' }}
      onClick={onView}
    >
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(cohort.status)}`}>
        {cohort.status}
      </div>

      <h3 className="text-xl font-bold text-white mb-4 pr-20">{cohort.name}</h3>
      
      {cohort.description && (
        <p className="text-gray-400 text-sm mb-4">{cohort.description}</p>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Users className="w-4 h-4" />
          <span>{cohort.capacity?.current || 0}/{cohort.capacity?.max || 50} students</span>
        </div>
        
        {cohort.teacher && (
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span className="text-lg">👨‍🏫</span>
            <span>{cohort.teacher.name}</span>
          </div>
        )}

        {cohort.schedule?.classTimes?.length > 0 && (
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{cohort.schedule.classTimes[0]?.day} {cohort.schedule.classTimes[0]?.startTime}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <DollarSign className="w-4 h-4" />
          <span>R$ {cohort.pricing?.amount?.toLocaleString('pt-BR') || 0}/month</span>
        </div>
      </div>

      {/* Hover Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-sofluent-dark/95 backdrop-blur-sm rounded-2xl p-6 border border-sofluent-cherry/50 z-10"
        >
          <h4 className="text-lg font-bold text-white mb-4">{cohort.name}</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Status:</strong> {cohort.status}</p>
            <p><strong>Capacity:</strong> {cohort.capacity?.current || 0}/{cohort.capacity?.max || 50}</p>
            {cohort.schedule?.startDate && (
              <p><strong>Start:</strong> {new Date(cohort.schedule.startDate).toLocaleDateString()}</p>
            )}
            <p><strong>Revenue:</strong> R$ {cohort.pricing?.amount?.toLocaleString('pt-BR') || 0}/month</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              as={BrandButton}
              variant="ghost"
              size="small"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              View Details
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const CohortManagement = () => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'canvas'

  useEffect(() => {
    fetchCohorts();
  }, [filter, sortBy]);

  const fetchCohorts = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/admin/cohorts?status=${filter}&sortBy=${sortBy}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCohorts(data.cohorts || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty cohorts array
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Cohort Management - So Fluent"
        background="bg-gradient-to-br from-sofluent-black via-sofluent-dark to-sofluent-black"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Cohort Management - So Fluent"
      seoDescription="Manage student cohorts and groups"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      showNavbar={false}
      showFooter={false}
    >
    <div className="p-8">
      {/* Header */}
      <div className="bg-sofluent-dark/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            Cohort Management
          </h1>
          <BrandButton
            onClick={() => navigate('/admin/cohorts/new')}
            variant="primary"
            size="small"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Cohort
          </BrandButton>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-sofluent-dark border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-sofluent-dark border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
            >
              <option value="startDate">Start Date</option>
              <option value="students">Students</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-sofluent-cherry text-white' 
                : 'bg-sofluent-dark text-gray-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('canvas')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'canvas' 
                ? 'bg-sofluent-cherry text-white' 
                : 'bg-sofluent-dark text-gray-400 hover:text-white'
            }`}
            title="Canvas View (Drag & Drop)"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>

        {/* Cohorts Display */}
        {viewMode === 'canvas' ? (
          <CohortCanvas
            cohorts={cohorts}
            backendUrl={backendUrl}
            getToken={getToken}
            onUpdatePosition={async (cohortId, position) => {
              try {
                const token = await getToken();
                await fetch(`${backendUrl}/api/admin/cohorts/${cohortId}/position`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(position)
                });
              } catch (error) {
                console.error('Failed to update position:', error);
              }
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts.map((cohort) => (
              <CohortCard
                key={cohort._id}
                cohort={cohort}
                getStatusColor={getStatusColor}
                onEdit={() => navigate(`/admin/cohorts/${cohort._id}/edit`)}
                onView={() => navigate(`/admin/cohorts/${cohort._id}`)}
              />
            ))}
          </div>
        )}

        {cohorts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No cohorts found</p>
            <BrandButton
              onClick={() => navigate('/admin/cohorts/new')}
              variant="primary"
              size="medium"
              className="mt-4"
            >
              Create Your First Cohort
            </BrandButton>
          </div>
        )}
      </div>
    </div>
    </StandardPage>
  );
};

export default CohortManagement;

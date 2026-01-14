/**
 * Missions Page
 * Feature 4: Real-World Mission System™
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { Target, Camera, Video, Mic, Type, MapPin, Upload, CheckCircle, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

// MissionCard component - must be defined before Missions component
const MissionCard = ({ mission, getTypeIcon, onSelect }) => {
  const { t } = useTranslation();
  const completed = mission.completed;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-[#E91E63]/50 transition-all ${
        completed ? 'opacity-60' : ''
      }`}
      onClick={!completed ? onSelect : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            completed ? 'bg-green-500/20' : 'bg-[#E91E63]/20'
          }`}>
            {getTypeIcon(mission.type)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{mission.title}</h3>
            <p className="text-sm text-gray-400">{mission.description}</p>
          </div>
        </div>
        {completed && (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{mission.duration || '7 days'}</span>
        </div>
        <div className="text-sm font-bold text-[#D4AF37]">
          +{mission.xpReward || 100} XP
        </div>
      </div>
    </motion.div>
  );
};

// SubmitMissionModal component
const SubmitMissionModal = ({ mission, onClose, onSubmitted, backendUrl, getToken }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (mission.type !== 'text' && !file) {
      return;
    }
    if (mission.type === 'text' && !text.trim()) {
      return;
    }

    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      
      if (mission.type === 'text') {
        formData.append('text', text);
      } else {
        formData.append('file', file);
      }

      const response = await fetch(`${backendUrl}/api/missions/${mission._id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        onSubmitted();
        onClose();
      }
    } catch (error) {
      // Error submitting mission
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-white mb-4">{mission.title}</h2>
        <p className="text-gray-400 mb-6">{mission.description}</p>
        
        {mission.type === 'text' ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#E91E63] mb-6"
            placeholder={t('missions.enterText', 'Enter your submission...')}
            rows={5}
          />
        ) : (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="w-full mb-6"
            accept={mission.type === 'photo' ? 'image/*' : mission.type === 'video' ? 'video/*' : 'audio/*'}
          />
        )}
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            {t('missions.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all disabled:opacity-50"
          >
            {uploading ? t('missions.submitting', 'Submitting...') : t('missions.submit', 'Submit')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Missions = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/missions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMissions(data.missions || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty missions array
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Mic className="w-5 h-5" />;
      case 'text': return <Type className="w-5 h-5" />;
      case 'location': return <MapPin className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Missions - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Missions - So Fluent"
      seoDescription="Complete real-world English challenges"
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
            <Trophy className="w-16 h-16 text-[#D4AF37] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('missions.title', 'Real-World Missions')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('missions.subtitle', 'Complete daily challenges, upload proof, earn XP, and level up!')}
          </p>
        </div>

        {/* Missions Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <MissionCard
                key={mission._id}
                mission={mission}
                getTypeIcon={getTypeIcon}
                onSelect={() => {
                  setSelectedMission(mission);
                  setShowSubmitModal(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Submit Modal */}
        {showSubmitModal && selectedMission && (
          <SubmitMissionModal
            mission={selectedMission}
            onClose={() => {
              setShowSubmitModal(false);
              setSelectedMission(null);
            }}
            onSubmitted={fetchMissions}
            backendUrl={backendUrl}
            getToken={getToken}
          />
        )}
      </div>
      </div>
    </StandardPage>
  );
};

export default Missions;

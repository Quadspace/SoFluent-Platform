/**
 * Success Story Generator Page
 * Feature 9: Success Story Generator™
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { Video, Share2, Download, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

// StoryCard component - must be defined before SuccessStory component
const StoryCard = ({ story, onShare }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#E91E63]/50 transition-all group"
    >
      <div className="aspect-video bg-gradient-to-br from-[#E91E63]/20 to-[#D4AF37]/20 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Video className="w-16 h-16 text-white/50 group-hover:text-[#E91E63] transition-colors" />
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onShare(story._id)}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{story.title}</h3>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-semibold">{story.stats?.level || 'Intermediate'}</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{story.description}</p>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <div className="text-gray-400">{t('successStory.courses', 'Courses')}</div>
            <div className="text-white font-bold">{story.stats?.coursesCompleted}</div>
          </div>
          <div>
            <div className="text-gray-400">{t('successStory.streak', 'Streak')}</div>
            <div className="text-white font-bold">{story.stats?.streak} {t('successStory.days', 'days')}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all">
            {t('successStory.watch', 'Watch')}
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SuccessStory = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [stories, setStories] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('journey');
  const [selectedMusic, setSelectedMusic] = useState('default');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/success-story`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStories(data.stories || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty stories array
    }
  };

  const generateStory = async () => {
    setGenerating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/success-story/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: selectedTemplate,
          music: selectedMusic
        })
      });

      if (response.ok) {
        await fetchStories();
      }
    } catch (error) {
      // Handle generation error silently
    } finally {
      setGenerating(false);
    }
  };

  const shareStory = async (storyId, platforms) => {
    try {
      const token = await getToken();
      await fetch(`${backendUrl}/api/success-story/${storyId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platforms })
      });
    } catch (error) {
      // Handle sharing error silently
    }
  };

  return (
    <StandardPage
      seoTitle="Success Story Generator - So Fluent"
      seoDescription="Create and share your English learning journey"
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
            <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('successStory.title', 'Success Story Generator™')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('successStory.subtitle', 'Celebrate your journey! Generate a shareable video of your English learning success.')}
          </p>
        </div>

        {/* Generate Section */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('successStory.createNew', 'Create Your Success Story')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                {t('successStory.template', 'Template')}
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E91E63]"
              >
                <option value="journey">{t('successStory.journey', 'Journey')}</option>
                <option value="achievement">{t('successStory.achievement', 'Achievement')}</option>
                <option value="motivational">{t('successStory.motivational', 'Motivational')}</option>
                <option value="transformation">{t('successStory.transformation', 'Transformation')}</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                {t('successStory.music', 'Music')}
              </label>
              <select
                value={selectedMusic}
                onChange={(e) => setSelectedMusic(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E91E63]"
              >
                <option value="default">{t('successStory.default', 'Default')}</option>
                <option value="upbeat">{t('successStory.upbeat', 'Upbeat')}</option>
                <option value="inspiring">{t('successStory.inspiring', 'Inspiring')}</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateStory}
            disabled={generating}
            className="w-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('successStory.generating', 'Generating Your Story...')}
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                {t('successStory.generate', 'Generate Success Story')}
              </>
            )}
          </button>
        </div>

        {/* Stories Grid */}
        {stories.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('successStory.myStories', 'My Success Stories')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard
                  key={story._id}
                  story={story}
                  onShare={shareStory}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </StandardPage>
  );
};

export default SuccessStory;

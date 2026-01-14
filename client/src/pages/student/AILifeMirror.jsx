/**
 * AI Life Mirror Page
 * Feature 1: AI Life Mirror™
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { Sparkles, Instagram, Linkedin, BookOpen, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import InstagramConnect from '../../components/instagram/InstagramConnect';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const AILifeMirror = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);

  useEffect(() => {
    checkConnections();
    fetchLessons();
  }, []);

  const checkConnections = async () => {
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
          setInstagramConnected(data.user?.instagramConnect || false);
        }
      }
    } catch (error) {
      // Handle connection check error silently
    }
  };

  const fetchLessons = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/ai-life-mirror/lessons`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setLessons(data.lessons || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty lessons array
    } finally {
      setLoading(false);
    }
  };

  const generateLessons = async () => {
    setGenerating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/ai-life-mirror/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchLessons();
      }
    } catch (error) {
      // Handle generation error silently
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="AI Life Mirror - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="AI Life Mirror - So Fluent"
      seoDescription="Learn English through your Instagram and LinkedIn"
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
            {t('aiLifeMirror.title', 'AI Life Mirror™')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('aiLifeMirror.subtitle', 'Learn English from YOUR life. AI creates personalized lessons from your Instagram and LinkedIn.')}
          </p>
        </div>

        {/* Connection Section */}
        {!instagramConnected && (
          <div className="max-w-2xl mx-auto mb-12">
            <InstagramConnect
              onConnect={() => {
                setInstagramConnected(true);
                checkConnections();
              }}
              backendUrl={backendUrl}
              getToken={getToken}
            />
          </div>
        )}

        {/* Lessons Section */}
        {instagramConnected && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {t('aiLifeMirror.myLessons', 'My Life Lessons')}
              </h2>
              <button
                onClick={generateLessons}
                disabled={generating}
                className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('aiLifeMirror.generating', 'Generating...')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t('aiLifeMirror.generateMore', 'Generate More Lessons')}
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-6">
                  {t('aiLifeMirror.noLessons', 'No lessons yet. Generate your first personalized lesson!')}
                </p>
                <button
                  onClick={generateLessons}
                  className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all"
                >
                  {t('aiLifeMirror.generateFirst', 'Generate First Lesson')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <LessonCard key={lesson._id} lesson={lesson} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </StandardPage>
  );
};

const LessonCard = ({ lesson }) => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const [completed, setCompleted] = useState(lesson.completed || false);

  const completeLesson = async () => {
    try {
      const token = await getToken();
      await fetch(`${backendUrl}/api/ai-life-mirror/lessons/${lesson._id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress: 100 })
      });
      setCompleted(true);
    } catch (error) {
      // Handle completion error silently
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-2 rounded-2xl overflow-hidden ${
        completed ? 'border-[#4CAF50]' : 'border-white/10'
      }`}
    >
      {lesson.originalContent?.imageUrl && (
        <div className="aspect-video bg-white/5 relative">
          <img
            src={lesson.originalContent.imageUrl}
            alt="Your photo"
            className="w-full h-full object-cover"
          />
          {lesson.source === 'instagram' && (
            <div className="absolute top-2 right-2 bg-[#E91E63] p-2 rounded-full">
              <Instagram className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {lesson.englishContent?.title || 'Personalized Lesson'}
        </h3>

        {lesson.englishContent?.vocabulary && lesson.englishContent.vocabulary.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#D4AF37] mb-2">
              {t('aiLifeMirror.vocabulary', 'Vocabulary from YOUR life:')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {lesson.englishContent.vocabulary.slice(0, 5).map((word, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-[#E91E63]/20 text-[#E91E63] rounded text-xs font-semibold"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-gray-400 text-sm">
            {completed ? (
              <span className="text-[#4CAF50] font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {t('aiLifeMirror.completed', 'Completed')}
              </span>
            ) : (
              <span>{Math.round(lesson.progress || 0)}% {t('aiLifeMirror.complete', 'complete')}</span>
            )}
          </div>
          <button
            onClick={completeLesson}
            disabled={completed}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              completed
                ? 'bg-[#4CAF50]/20 text-[#4CAF50] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white hover:shadow-lg hover:shadow-[#E91E63]/50'
            }`}
          >
            {completed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <>
                <Play className="w-4 h-4 inline mr-1" />
                {t('aiLifeMirror.startLearning', 'Start Learning')}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AILifeMirror;

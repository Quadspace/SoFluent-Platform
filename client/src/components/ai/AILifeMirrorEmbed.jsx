/**
 * AI Life Mirror Embed Component
 * Reusable component for embedding AI Life Mirror functionality
 * Can be used in dashboard, profile, or standalone pages
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { Sparkles, Instagram, BookOpen, Play, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import InstagramConnect from '../instagram/InstagramConnect';
import BrandButton from '../common/BrandButton';
import BrandCard from '../common/BrandCard';

const AILifeMirrorEmbed = ({ compact = false, onLessonSelect }) => {
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
      // Handle error silently
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

  if (compact) {
    return (
      <BrandCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sofluent-cherry to-sofluent-gold flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('aiLifeMirror.title', 'AI Life Mirror™')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('aiLifeMirror.subtitle', 'Learn from YOUR life')}
              </p>
            </div>
          </div>
          {instagramConnected && (
            <BrandButton
              variant="primary"
              size="small"
              onClick={generateLessons}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('aiLifeMirror.generate', 'Generate')
              )}
            </BrandButton>
          )}
        </div>

        {!instagramConnected ? (
          <InstagramConnect
            onConnect={() => {
              setInstagramConnected(true);
              checkConnections();
            }}
            backendUrl={backendUrl}
            getToken={getToken}
          />
        ) : loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-sofluent-cherry" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">
              {t('aiLifeMirror.noLessons', 'No lessons yet. Generate your first personalized lesson!')}
            </p>
            <BrandButton variant="primary" onClick={generateLessons} disabled={generating}>
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('aiLifeMirror.generateFirst', 'Generate First Lesson')
              )}
            </BrandButton>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.slice(0, 3).map((lesson) => (
              <LessonCardCompact
                key={lesson._id}
                lesson={lesson}
                onClick={() => onLessonSelect?.(lesson)}
              />
            ))}
            {lessons.length > 3 && (
              <BrandButton
                variant="ghost"
                size="small"
                onClick={() => window.location.href = '/ai-life-mirror'}
                className="w-full"
              >
                {t('aiLifeMirror.viewAll', 'View All Lessons')} ({lessons.length})
              </BrandButton>
            )}
          </div>
        )}
      </BrandCard>
    );
  }

  return (
    <div className="ai-life-mirror-embed">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-4"
        >
          <Sparkles className="w-16 h-16 text-sofluent-gold mx-auto" />
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-2">
          {t('aiLifeMirror.title', 'AI Life Mirror™')}
        </h2>
        <p className="text-lg text-gray-400">
          {t('aiLifeMirror.subtitle', 'Learn English from YOUR life. AI creates personalized lessons from your Instagram and LinkedIn.')}
        </p>
      </div>

      {/* Connection Section */}
      {!instagramConnected && (
        <div className="max-w-2xl mx-auto mb-8">
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
            <h3 className="text-xl font-bold text-white">
              {t('aiLifeMirror.myLessons', 'My Life Lessons')}
            </h3>
            <BrandButton
              variant="primary"
              onClick={generateLessons}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('aiLifeMirror.generating', 'Generating...')}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t('aiLifeMirror.generateMore', 'Generate More Lessons')}
                </>
              )}
            </BrandButton>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-sofluent-cherry" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-6">
                {t('aiLifeMirror.noLessons', 'No lessons yet. Generate your first personalized lesson!')}
              </p>
              <BrandButton variant="primary" onClick={generateLessons} disabled={generating}>
                {generating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('aiLifeMirror.generateFirst', 'Generate First Lesson')
                )}
              </BrandButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson._id}
                  lesson={lesson}
                  onClick={() => onLessonSelect?.(lesson)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LessonCard = ({ lesson, onClick }) => {
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
      onClick={onClick}
      className={`cursor-pointer bg-gradient-to-br from-sofluent-dark to-sofluent-black border-2 rounded-2xl overflow-hidden transition-all hover:scale-105 ${
        completed ? 'border-green-500/50' : 'border-white/10'
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
            <div className="absolute top-2 right-2 bg-sofluent-cherry p-2 rounded-full">
              <Instagram className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <h4 className="text-xl font-bold text-white mb-2">
          {lesson.englishContent?.title || 'Personalized Lesson'}
        </h4>

        {lesson.englishContent?.vocabulary && lesson.englishContent.vocabulary.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-sofluent-gold mb-2">
              {t('aiLifeMirror.vocabulary', 'Vocabulary from YOUR life:')}
            </h5>
            <div className="flex flex-wrap gap-2">
              {lesson.englishContent.vocabulary.slice(0, 5).map((word, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-sofluent-cherry/20 text-sofluent-cherry rounded text-xs font-semibold"
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
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {t('aiLifeMirror.completed', 'Completed')}
              </span>
            ) : (
              <span>{Math.round(lesson.progress || 0)}% {t('aiLifeMirror.complete', 'complete')}</span>
            )}
          </div>
          <BrandButton
            variant={completed ? 'ghost' : 'primary'}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (!completed) completeLesson();
            }}
            disabled={completed}
          >
            {completed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <>
                <Play className="w-4 h-4" />
                {t('aiLifeMirror.startLearning', 'Start Learning')}
              </>
            )}
          </BrandButton>
        </div>
      </div>
    </motion.div>
  );
};

const LessonCardCompact = ({ lesson, onClick }) => {
  const { t } = useTranslation();
  const [completed] = useState(lesson.completed || false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClick}
      className={`cursor-pointer bg-white/5 border rounded-lg p-3 hover:bg-white/10 transition-all ${
        completed ? 'border-green-500/50' : 'border-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        {lesson.originalContent?.imageUrl && (
          <img
            src={lesson.originalContent.imageUrl}
            alt="Lesson"
            className="w-12 h-12 rounded object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-bold text-white truncate">
            {lesson.englishContent?.title || 'Personalized Lesson'}
          </h5>
          <p className="text-xs text-gray-400">
            {completed ? (
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {t('aiLifeMirror.completed', 'Completed')}
              </span>
            ) : (
              `${Math.round(lesson.progress || 0)}% ${t('aiLifeMirror.complete', 'complete')}`
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AILifeMirrorEmbed;

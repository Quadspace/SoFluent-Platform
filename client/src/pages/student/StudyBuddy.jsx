/**
 * Study Buddy Page
 * Feature 8: Smart Study Buddy™
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { BookOpen, CheckCircle, XCircle, TrendingUp, Plus, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const StudyBuddy = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quality, setQuality] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWordsForReview();
    fetchStats();
  }, []);

  const fetchWordsForReview = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/study-buddy/review`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWords(data.words || []);
            if (data.words && data.words.length > 0) {
              setCurrentWord(data.words[0]);
            }
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty words array
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/study-buddy/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.stats);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use default stats
    }
  };

  const submitReview = async (quality) => {
    if (!currentWord) return;

    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/study-buddy/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wordId: currentWord._id,
          quality
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Move to next word
          const currentIndex = words.findIndex(w => w._id === currentWord._id);
          if (currentIndex < words.length - 1) {
            setCurrentWord(words[currentIndex + 1]);
          } else {
            setCurrentWord(null);
          }
          setShowAnswer(false);
          setQuality(null);
          await fetchWordsForReview();
          await fetchStats();
        }
      }
    } catch (error) {
      // Handle submission error silently
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Smart Study Buddy - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Smart Study Buddy - So Fluent"
      seoDescription="Master vocabulary with spaced repetition"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
    >
      <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <BookOpen className="w-16 h-16 text-[#D4AF37] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('studyBuddy.title', 'Smart Study Buddy™')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('studyBuddy.subtitle', 'Never forget a word again. Spaced repetition system powered by science.')}
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-white mb-1">{stats.totalWords}</div>
              <div className="text-sm text-gray-400">{t('studyBuddy.totalWords', 'Total Words')}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-[#4CAF50] mb-1">{stats.mastered}</div>
              <div className="text-sm text-gray-400">{t('studyBuddy.mastered', 'Mastered')}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-[#E91E63] mb-1">{stats.learning}</div>
              <div className="text-sm text-gray-400">{t('studyBuddy.learning', 'Learning')}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-[#FF9800] mb-1">{stats.dueForReview}</div>
              <div className="text-sm text-gray-400">{t('studyBuddy.dueReview', 'Due Review')}</div>
            </div>
          </div>
        )}

        {/* Quiz Card */}
        {currentWord ? (
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-white mb-4">
                {currentWord.word}
              </h2>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {currentWord.translation && (
                    <p className="text-xl text-[#D4AF37]">{currentWord.translation}</p>
                  )}
                  {currentWord.definition && (
                    <p className="text-gray-400">{currentWord.definition}</p>
                  )}
                  {currentWord.example && (
                    <p className="text-gray-300 italic">"{currentWord.example}"</p>
                  )}
                </motion.div>
              )}
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all"
              >
                {t('studyBuddy.showAnswer', 'Show Answer')}
              </button>
            ) : (
              <div>
                <p className="text-center text-gray-400 mb-6">
                  {t('studyBuddy.howWell', 'How well did you remember this word?')}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4, 5].map((q) => (
                    <button
                      key={q}
                      onClick={() => submitReview(q)}
                      className={`p-4 rounded-xl font-bold transition-all ${
                        q <= 2
                          ? 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30'
                          : q === 3
                          ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 hover:bg-yellow-600/30'
                          : 'bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30 hover:bg-[#4CAF50]/30'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-6">
              {t('studyBuddy.noWords', 'No words due for review! Great job! 🎉')}
            </p>
            <button className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              {t('studyBuddy.addWord', 'Add New Word')}
            </button>
          </div>
        )}
      </div>
      </div>
    </StandardPage>
  );
};

export default StudyBuddy;

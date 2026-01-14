/**
 * Career Accelerator Page
 * Feature 6: Career English Accelerator™
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { Briefcase, Linkedin, TrendingUp, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const Career = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkLinkedInConnection();
    fetchLessons();
  }, []);

  const checkLinkedInConnection = async () => {
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
          setLinkedInConnected(data.user?.linkedInConnected || false);
        }
      }
    } catch (error) {
      // Handle LinkedIn check error silently
    }
  };

  const fetchLessons = async () => {
    // Would fetch career-specific lessons
  };

  const connectLinkedIn = async () => {
    // LinkedIn OAuth flow
    const LINKEDIN_CLIENT_ID = process.env.REACT_APP_LINKEDIN_CLIENT_ID || 'your-linkedin-id';
    const REDIRECT_URI = `${window.location.origin}/career`;
    const SCOPE = 'r_liteprofile r_emailaddress';
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=random&scope=${SCOPE}`;
    window.location.href = authUrl;
  };

  const generateLessons = async () => {
    setGenerating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/career/generate-lessons`, {
        method: 'POST',
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
    } catch (error) {
      // Handle generation error silently
    } finally {
      setGenerating(false);
    }
  };

  return (
    <StandardPage
      seoTitle="Career Accelerator - So Fluent"
      seoDescription="Advance your career with English lessons based on your LinkedIn"
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
            <Briefcase className="w-16 h-16 text-[#0077B5] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('career.title', 'Career English Accelerator™')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('career.subtitle', 'Master English for YOUR career. Personalized lessons based on your LinkedIn profile.')}
          </p>
        </div>

        {/* LinkedIn Connection */}
        {!linkedInConnected && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center">
              <Linkedin className="w-16 h-16 text-[#0077B5] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('career.connectLinkedIn', 'Connect Your LinkedIn')}
              </h3>
              <p className="text-gray-400 mb-6">
                {t('career.connectDescription', 'We\'ll analyze your job title, industry, and experience to create personalized English lessons for your career.')}
              </p>
              <button
                onClick={connectLinkedIn}
                className="bg-[#0077B5] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#006399] transition-all flex items-center gap-2 mx-auto"
              >
                <Linkedin className="w-5 h-5" />
                {t('career.connect', 'Connect LinkedIn')}
              </button>
            </div>
          </div>
        )}

        {/* Lessons Section */}
        {linkedInConnected && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {t('career.myLessons', 'My Career Lessons')}
              </h2>
              <button
                onClick={generateLessons}
                disabled={generating}
                className="bg-gradient-to-r from-[#0077B5] to-[#006399] text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('career.generating', 'Generating...')}
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    {t('career.generateLessons', 'Generate Lessons')}
                  </>
                )}
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-6">
                  {t('career.noLessons', 'No career lessons yet. Generate your first personalized lesson!')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {lesson.englishContent?.title || 'Career Lesson'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {lesson.originalContent?.jobTitle || 'Professional English'}
                    </p>
                    <button className="w-full bg-gradient-to-r from-[#0077B5] to-[#006399] text-white font-bold py-3 rounded-xl">
                      {t('career.startLearning', 'Start Learning')}
                    </button>
                  </div>
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

export default Career;

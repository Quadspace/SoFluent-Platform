/**
 * Pronunciation Coach Page
 * Feature 7: AI Pronunciation Coach™
 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { Mic, Play, TrendingUp, Award, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const Pronunciation = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [phrase, setPhrase] = useState("I'm working out to feel confident and strong.");
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/pronunciation/records`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setRecords(data.records || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty records array
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzePronunciation(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      // Handle recording error silently
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const analyzePronunciation = async (audioBlob) => {
    setAnalyzing(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('phrase', phrase);

      const response = await fetch(`${backendUrl}/api/pronunciation/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResult(data.analysis);
          await fetchRecords();
        }
      }
    } catch (error) {
      // Handle analysis error silently
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <StandardPage
      seoTitle="AI Pronunciation Coach - So Fluent"
      seoDescription="Improve your English pronunciation with AI-powered feedback"
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
            <Volume2 className="w-16 h-16 text-[#D4AF37] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('pronunciation.title', 'AI Pronunciation Coach™')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('pronunciation.subtitle', 'Get real-time feedback on your pronunciation. Practice makes perfect!')}
          </p>
        </div>

        {/* Practice Section */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {t('pronunciation.practicePhrase', 'Practice This Phrase')}
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <p className="text-2xl text-white text-center font-semibold mb-4">
              "{phrase}"
            </p>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#E91E63] text-center"
              placeholder={t('pronunciation.enterPhrase', 'Enter phrase to practice...')}
            />
          </div>

          <div className="flex justify-center">
            {!recording ? (
              <button
                onClick={startRecording}
                className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold px-12 py-6 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all flex items-center gap-3"
              >
                <Mic className="w-6 h-6" />
                {t('pronunciation.startRecording', 'Start Recording')}
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 text-white font-bold px-12 py-6 rounded-xl hover:bg-red-700 transition-all flex items-center gap-3"
              >
                ⏹ {t('pronunciation.stopRecording', 'Stop Recording')}
              </button>
            )}
          </div>

          {analyzing && (
            <div className="text-center mt-6">
              <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-4">{t('pronunciation.analyzing', 'Analyzing your pronunciation...')}</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gradient-to-r from-[#4CAF50]/20 to-[#45A049]/20 border border-[#4CAF50]/30 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {t('pronunciation.results', 'Your Results')}
                </h3>
                <div className="text-3xl font-black text-[#4CAF50]">
                  {result.accuracy}%
                </div>
              </div>

              {result.feedback?.strengths && result.feedback.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[#4CAF50] font-semibold mb-2">
                    {t('pronunciation.strengths', 'Strengths:')}
                  </h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {result.feedback.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.feedback?.improvements && result.feedback.improvements.length > 0 && (
                <div>
                  <h4 className="text-[#FF9800] font-semibold mb-2">
                    {t('pronunciation.improvements', 'Areas to Improve:')}
                  </h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {result.feedback.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Recent Records */}
        {records.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('pronunciation.recentPractice', 'Recent Practice')}
            </h2>
            <div className="space-y-4">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-semibold">{record.phrase}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#4CAF50]">
                      {record.accuracy}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {record.attempts} {t('pronunciation.attempts', 'attempts')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </StandardPage>
  );
};

export default Pronunciation;

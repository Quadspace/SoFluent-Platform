/**
 * Google Meet Embed Component
 * Embeds Google Meet for live classes within So Fluent platform
 * Students never leave the platform!
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Video, Users, Clock, MessageSquare } from 'lucide-react';
import BrandButton from '../common/BrandButton';
import { motion } from 'framer-motion';

const GoogleMeetEmbed = ({ meetingId, eventId, title, startTime, endTime }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetUrl, setMeetUrl] = useState('');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchMeetUrl = async () => {
      try {
        if (meetingId) {
          // If we have meetingId directly, use it
          const url = `https://meet.google.com/${meetingId}?authuser=0&hs=122`;
          setMeetUrl(url);
          setLoading(false);
        } else if (eventId) {
          // Fetch from backend
          const response = await fetch(`/api/google/meet/${eventId}`);
          const data = await response.json();
          
          if (data.success) {
            setMeetUrl(data.meetUrl);
            setLoading(false);
            
            // Check if meeting is live
            const now = new Date();
            const start = new Date(data.startTime);
            const end = new Date(data.endTime);
            setIsLive(now >= start && now <= end);
          } else {
            setError(data.message);
            setLoading(false);
          }
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMeetUrl();
  }, [meetingId, eventId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-sofluent-cherry mb-4" />
        <span className="text-gray-400">{t('google.meet.loading', 'Loading meeting...')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="google-meet-container h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-sofluent-dark to-sofluent-black rounded-lg border border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Video className="w-6 h-6 text-sofluent-cherry" />
            {isLive && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title || t('google.meet.liveClass', 'Live Class')}</h3>
            {startTime && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(startTime).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        
        {isLive && (
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-400 font-semibold text-sm">
              {t('google.meet.live', 'LIVE')}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Google Meet Embed */}
      <div className="flex-1 border border-white/10 rounded-lg overflow-hidden bg-black">
        <iframe
          src={meetUrl}
          className="w-full h-full border-0"
          allow="camera; microphone; display-capture; fullscreen; autoplay"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          title="Google Meet"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 p-4 bg-sofluent-dark rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{t('google.meet.participants', 'Participants')}</span>
        </div>
        <div className="flex gap-2">
          <BrandButton variant="ghost" size="small">
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('google.meet.chat', 'Chat')}
          </BrandButton>
          <BrandButton variant="primary" size="small">
            {t('google.meet.leave', 'Leave')}
          </BrandButton>
        </div>
      </div>
    </div>
  );
};

export default GoogleMeetEmbed;

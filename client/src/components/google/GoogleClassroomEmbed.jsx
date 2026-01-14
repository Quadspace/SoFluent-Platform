/**
 * Google Classroom Embed Component
 * Embeds Google Classroom course within So Fluent platform
 * Students never leave the platform!
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ExternalLink, BookOpen } from 'lucide-react';
import BrandButton from '../common/BrandButton';

const GoogleClassroomEmbed = ({ courseId, studentEmail, accessToken }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classroomUrl, setClassroomUrl] = useState('');

  useEffect(() => {
    if (courseId) {
      // Generate embeddable Google Classroom URL
      const embedUrl = `https://classroom.google.com/c/${courseId}?embedded=true`;
      setClassroomUrl(embedUrl);
      setLoading(false);
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-sofluent-cherry" />
        <span className="ml-3 text-gray-400">{t('google.classroom.loading', 'Loading classroom...')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <BrandButton
          variant="primary"
          onClick={() => window.open(`https://classroom.google.com/c/${courseId}`, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {t('google.classroom.openExternal', 'Open in Google Classroom')}
        </BrandButton>
      </div>
    );
  }

  return (
    <div className="google-classroom-container h-full">
      <div className="flex items-center justify-between mb-4 p-4 bg-sofluent-dark rounded-lg">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-sofluent-cherry" />
          <h3 className="text-xl font-bold text-white">
            {t('google.classroom.title', 'Google Classroom')}
          </h3>
        </div>
        <BrandButton
          variant="ghost"
          size="small"
          onClick={() => window.open(`https://classroom.google.com/c/${courseId}`, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {t('google.classroom.openNewTab', 'Open in New Tab')}
        </BrandButton>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <iframe
          src={classroomUrl}
          className="w-full h-[calc(100vh-200px)] border-0"
          allow="camera; microphone; display-capture; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          title="Google Classroom"
        />
      </div>
    </div>
  );
};

export default GoogleClassroomEmbed;

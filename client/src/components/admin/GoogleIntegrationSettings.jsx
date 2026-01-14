/**
 * Google Integration Settings Component
 * Admin-friendly interface to configure Google Workspace integration
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Loader2, Settings, BookOpen, Video, Drive, Calendar, Bot } from 'lucide-react';
import BrandButton from '../common/BrandButton';
import BrandCard from '../common/BrandCard';
import { motion } from 'framer-motion';

const GoogleIntegrationSettings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    googleClassroom: 'unknown',
    googleMeet: 'unknown',
    googleDrive: 'unknown',
    googleCalendar: 'unknown',
    openRouter: 'unknown'
  });

  const checkIntegration = async (service) => {
    setLoading(true);
    try {
      // Test API endpoint
      const response = await fetch(`/api/google/${service}/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        setStatus(prev => ({ ...prev, [service]: 'connected' }));
      } else {
        setStatus(prev => ({ ...prev, [service]: 'error' }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, [service]: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (serviceStatus) => {
    switch (serviceStatus) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = (serviceStatus) => {
    switch (serviceStatus) {
      case 'connected':
        return t('admin.google.status.connected', 'Connected');
      case 'error':
        return t('admin.google.status.error', 'Error');
      default:
        return t('admin.google.status.checking', 'Checking...');
    }
  };

  const integrations = [
    {
      id: 'googleClassroom',
      name: t('admin.google.classroom.title', 'Google Classroom'),
      description: t('admin.google.classroom.description', 'Course management and student enrollment'),
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      setupUrl: 'https://console.cloud.google.com/apis/library/classroom.googleapis.com'
    },
    {
      id: 'googleMeet',
      name: t('admin.google.meet.title', 'Google Meet'),
      description: t('admin.google.meet.description', 'Live classes and video meetings'),
      icon: Video,
      color: 'from-green-500 to-green-600',
      setupUrl: 'https://console.cloud.google.com/apis/library/calendar-json.googleapis.com'
    },
    {
      id: 'googleDrive',
      name: t('admin.google.drive.title', 'Google Drive'),
      description: t('admin.google.drive.description', 'File storage and organization'),
      icon: Drive,
      color: 'from-yellow-500 to-yellow-600',
      setupUrl: 'https://console.cloud.google.com/apis/library/drive.googleapis.com'
    },
    {
      id: 'googleCalendar',
      name: t('admin.google.calendar.title', 'Google Calendar'),
      description: t('admin.google.calendar.description', 'Class scheduling and reminders'),
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      setupUrl: 'https://console.cloud.google.com/apis/library/calendar-json.googleapis.com'
    },
    {
      id: 'openRouter',
      name: t('admin.google.openrouter.title', 'OpenRouter AI'),
      description: t('admin.google.openrouter.description', 'AI-powered features (81% cost savings)'),
      icon: Bot,
      color: 'from-pink-500 to-pink-600',
      setupUrl: 'https://openrouter.ai'
    }
  ];

  return (
    <div className="google-integration-settings p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-sofluent-cherry" />
        <h2 className="text-2xl font-bold text-white">
          {t('admin.google.title', 'Google Workspace Integration')}
        </h2>
      </div>

      <p className="text-gray-400 mb-8">
        {t('admin.google.description', 'Configure Google Workspace services and OpenRouter AI. All services are embedded within So Fluent - students never leave the platform!')}
      </p>

      {/* Setup Guide Link */}
      <BrandCard className="mb-6 bg-gradient-to-r from-sofluent-dark to-sofluent-black border-sofluent-cherry/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              {t('admin.google.setup.title', 'Need Help Setting Up?')}
            </h3>
            <p className="text-gray-400 text-sm">
              {t('admin.google.setup.description', 'Follow our step-by-step guide to configure Google Cloud Console and OpenRouter.')}
            </p>
          </div>
          <BrandButton
            variant="primary"
            onClick={() => window.open('/docs/google-workspace-setup', '_blank')}
          >
            {t('admin.google.setup.button', 'View Setup Guide')}
          </BrandButton>
        </div>
      </BrandCard>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const serviceStatus = status[integration.id];

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <BrandCard className="h-full bg-gradient-to-br from-sofluent-dark to-sofluent-black border-white/10 hover:border-sofluent-cherry/50 transition-all">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {getStatusIcon(serviceStatus)}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {integration.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {integration.description}
                </p>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-500">
                    {t('admin.google.status.label', 'Status')}:
                  </span>
                  <span className={`text-xs font-semibold ${
                    serviceStatus === 'connected' ? 'text-green-400' :
                    serviceStatus === 'error' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {getStatusText(serviceStatus)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <BrandButton
                    variant="ghost"
                    size="small"
                    onClick={() => checkIntegration(integration.id)}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t('admin.google.test', 'Test')
                    )}
                  </BrandButton>
                  <BrandButton
                    variant="primary"
                    size="small"
                    onClick={() => window.open(integration.setupUrl, '_blank')}
                    className="flex-1"
                  >
                    {t('admin.google.setup', 'Setup')}
                  </BrandButton>
                </div>
              </BrandCard>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Setup Instructions */}
      <BrandCard className="mt-8 bg-gradient-to-r from-sofluent-dark to-sofluent-black">
        <h3 className="text-lg font-bold text-white mb-4">
          {t('admin.google.quickSetup.title', 'Quick Setup Instructions')}
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>{t('admin.google.quickSetup.step1', 'Go to Google Cloud Console and create a project')}</li>
          <li>{t('admin.google.quickSetup.step2', 'Enable required APIs (Classroom, Calendar, Drive, OAuth2)')}</li>
          <li>{t('admin.google.quickSetup.step3', 'Create OAuth 2.0 credentials')}</li>
          <li>{t('admin.google.quickSetup.step4', 'Create service account and download JSON key')}</li>
          <li>{t('admin.google.quickSetup.step5', 'Sign up for OpenRouter and get API key')}</li>
          <li>{t('admin.google.quickSetup.step6', 'Add credentials to server/.env file')}</li>
          <li>{t('admin.google.quickSetup.step7', 'Click "Test" on each service above')}</li>
        </ol>
      </BrandCard>
    </div>
  );
};

export default GoogleIntegrationSettings;

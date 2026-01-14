/**
 * Google Login Component
 * One-click Google OAuth sign-in
 * Handles OAuth flow and token management
 */

import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk } from '@clerk/clerk-react';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import BrandButton from '../common/BrandButton';
import BrandCard from '../common/BrandCard';
import { motion } from 'framer-motion';

const GoogleLogin = ({ onSuccess, onError, redirectTo = '/dashboard' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const { signIn, setActive } = useClerk();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(error === 'access_denied' 
        ? t('auth.google.accessDenied', 'Access denied. Please try again.')
        : t('auth.google.error', 'Authentication failed. Please try again.')
      );
      onError?.(error);
      return;
    }

    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code) => {
    setLoading(true);
    setStatus('loading');

    try {
      // Exchange code for tokens
      const response = await fetch(`${backendUrl}/api/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        if (data.accessToken) {
          localStorage.setItem('googleAccessToken', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('googleRefreshToken', data.refreshToken);
        }

        // Sign in with Clerk if user data provided
        if (data.user && signIn) {
          try {
            await signIn.create({
              strategy: 'oauth_google',
              redirectUrl: window.location.origin + redirectTo
            });
          } catch (clerkError) {
            // If Clerk OAuth fails, try email/password or create account
            // Fallback to alternative authentication method
          }
        }

        setStatus('success');
        onSuccess?.(data);

        // Redirect after short delay
        setTimeout(() => {
          navigate(redirectTo);
        }, 1500);
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || t('auth.google.error', 'Authentication failed. Please try again.'));
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const initiateGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setStatus('error');
      setErrorMessage(t('auth.google.notConfigured', 'Google login is not configured. Please contact support.'));
      return;
    }

    setLoading(true);
    setStatus('loading');

    try {
      // Build OAuth URL
      const redirectUri = `${window.location.origin}/api/google/callback`;
      const scope = [
        'https://www.googleapis.com/auth/classroom.courses',
        'https://www.googleapis.com/auth/classroom.rosters',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ].join(' ');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent`;

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || t('auth.google.error', 'Failed to initiate login. Please try again.'));
      setLoading(false);
      onError?.(error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'loading':
        return <Loader2 className="w-6 h-6 animate-spin text-sofluent-cherry" />;
      default:
        return null;
    }
  };

  return (
    <div className="google-login-container">
      <BrandCard className="p-6">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('auth.google.title', 'Sign in with Google')}
          </h2>
          <p className="text-gray-400">
            {t('auth.google.description', 'Connect your Google account to access Google Workspace features')}
          </p>
        </div>

        {/* Status Display */}
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
              status === 'success' ? 'bg-green-500/10 border border-green-500/20' :
              status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
              'bg-blue-500/10 border border-blue-500/20'
            }`}
          >
            {getStatusIcon()}
            <div className="flex-1">
              {status === 'success' && (
                <p className="text-green-400 font-semibold">
                  {t('auth.google.success', 'Successfully connected! Redirecting...')}
                </p>
              )}
              {status === 'error' && (
                <div>
                  <p className="text-red-400 font-semibold">
                    {t('auth.google.error', 'Authentication failed')}
                  </p>
                  {errorMessage && (
                    <p className="text-red-300 text-sm mt-1">{errorMessage}</p>
                  )}
                </div>
              )}
              {status === 'loading' && (
                <p className="text-blue-400">
                  {t('auth.google.loading', 'Connecting to Google...')}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Warning if not configured */}
        {!GOOGLE_CLIENT_ID && (
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm">
                {t('auth.google.notConfigured', 'Google login not configured')}
              </p>
              <p className="text-yellow-300 text-xs mt-1">
                {t('auth.google.notConfiguredDesc', 'Please set VITE_GOOGLE_CLIENT_ID in your environment variables')}
              </p>
            </div>
          </div>
        )}

        {/* Login Button */}
        <BrandButton
          variant="primary"
          onClick={initiateGoogleLogin}
          disabled={loading || !GOOGLE_CLIENT_ID}
          className="w-full"
          size="large"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('auth.google.connecting', 'Connecting...')}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('auth.google.button', 'Continue with Google')}
            </>
          )}
        </BrandButton>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t('auth.google.privacy', 'By continuing, you agree to So Fluent\'s Terms of Service and Privacy Policy')}
        </p>
      </BrandCard>
    </div>
  );
};

export default GoogleLogin;

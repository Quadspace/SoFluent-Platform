/**
 * Error Display Component
 * Displays user-friendly error messages
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, RefreshCw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  onDismiss,
  variant = 'default',
  showIcon = true,
  showActions = true,
  className = ''
}) => {
  const { t } = useTranslation();

  if (!error) return null;

  const getErrorType = () => {
    if (typeof error === 'string') return error;
    if (error?.type) {
      switch (error.type) {
        case 'network':
          return t('errors.network', 'Network error. Please check your connection.');
        case 'auth':
          return t('errors.auth', 'Authentication required. Please sign in.');
        case 'permission':
          return t('errors.permission', 'You do not have permission to perform this action.');
        case 'not_found':
          return t('errors.notFound', 'Resource not found.');
        case 'rate_limit':
          return t('errors.rateLimit', 'Too many requests. Please try again later.');
        case 'server':
          return t('errors.server', 'Server error. Please try again later.');
        default:
          return error.message || t('errors.unknown', 'An error occurred. Please try again.');
      }
    }
    return error.message || t('errors.unknown', 'An error occurred. Please try again.');
  };

  const variants = {
    default: 'bg-red-50 border-red-200 text-red-800',
    inline: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    toast: 'bg-red-100 border-red-300 text-red-900',
  };

  const errorMessage = getErrorType();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`${variants[variant]} ${className} border rounded-lg p-4 flex items-start gap-3`}
      >
        {showIcon && (
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}
        
        <div className="flex-1">
          <p className="font-semibold text-sm">{errorMessage}</p>
          
          {showActions && (
            <div className="flex items-center gap-3 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-current rounded-md text-xs font-semibold hover:bg-opacity-10 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  {t('errors.retry', 'Retry')}
                </button>
              )}
              
              {variant === 'default' && (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-current rounded-md text-xs font-semibold hover:bg-opacity-10 transition-colors"
                >
                  <Home className="w-3 h-3" />
                  {t('errors.goHome', 'Go Home')}
                </Link>
              )}
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-opacity-20 rounded transition-colors"
            aria-label={t('errors.dismiss', 'Dismiss')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorDisplay;

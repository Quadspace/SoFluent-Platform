/**
 * useErrorHandler Hook
 * Centralized error handling with toast notifications
 */

import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { initSentry } from '../utils/sentry';

export const useErrorHandler = () => {
  const { t } = useTranslation();

  const handleError = useCallback((error, options = {}) => {
    const {
      showToast = true,
      toastType = 'error',
      logToSentry = true,
      customMessage,
      onError,
    } = options;

    // Get error message
    let errorMessage = customMessage;
    
    if (!errorMessage) {
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.type) {
        switch (error.type) {
          case 'network':
            errorMessage = t('errors.network', 'Network error. Please check your connection.');
            break;
          case 'auth':
            errorMessage = t('errors.auth', 'Authentication required. Please sign in.');
            break;
          case 'permission':
            errorMessage = t('errors.permission', 'You do not have permission to perform this action.');
            break;
          case 'not_found':
            errorMessage = t('errors.notFound', 'Resource not found.');
            break;
          case 'rate_limit':
            errorMessage = t('errors.rateLimit', 'Too many requests. Please try again later.');
            break;
          case 'server':
            errorMessage = t('errors.server', 'Server error. Please try again later.');
            break;
          default:
            errorMessage = error.message || t('errors.unknown', 'An error occurred. Please try again.');
        }
      } else {
        errorMessage = error?.message || t('errors.unknown', 'An error occurred. Please try again.');
      }
    }

    // Log to Sentry in production
    if (logToSentry && process.env.NODE_ENV === 'production' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          errorType: error?.type || 'unknown',
        },
        extra: {
          message: errorMessage,
        },
      });
    }

    // Show toast notification
    if (showToast) {
      toast[toastType](errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorMessage);
    }

    return errorMessage;
  }, [t]);

  return { handleError };
};

export default useErrorHandler;

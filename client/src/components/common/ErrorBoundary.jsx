/**
 * Error Boundary Component
 * Catches React errors and displays user-friendly error page
 * Prevents white screen crashes
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Log to error tracking service (Sentry) if available
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        onReload={this.handleReload}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

/**
 * Error Fallback UI Component
 */
const ErrorFallback = ({ error, onReload, onGoHome }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#1A1A2E] rounded-2xl p-8 border border-[#E91E63]/20 shadow-2xl">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#E91E63]/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#E91E63]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          {t('errorBoundary.title', 'Oops! Something went wrong')}
        </h1>
        
        <p className="text-gray-400 text-center mb-8">
          {t('errorBoundary.message', 'We encountered an unexpected error. Don\'t worry, our team has been notified.')}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV !== 'production' && error && (
          <div className="mb-6 p-4 bg-black/50 rounded-lg border border-red-500/20">
            <p className="text-red-400 text-sm font-mono mb-2">
              {error.toString()}
            </p>
            {error.stack && (
              <pre className="text-xs text-gray-500 overflow-auto max-h-40">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReload}
            className="px-6 py-3 bg-[#E91E63] hover:bg-[#E91E63]/90 text-white font-semibold rounded-lg transition-colors"
          >
            {t('errorBoundary.reload', 'Reload Page')}
          </button>
          
          <button
            onClick={onGoHome}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {t('errorBoundary.goHome', 'Go to Home')}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {t('errorBoundary.help', 'If this problem persists, please contact support.')}
        </p>
      </div>
    </div>
  );
};

export default ErrorBoundary;

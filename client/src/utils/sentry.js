/**
 * Sentry Error Tracking Setup
 * Provides error logging and monitoring for production
 */

// Initialize Sentry only if DSN is provided
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  // Dynamic import to avoid including Sentry in bundle if not needed
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE || 'development',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    // Make Sentry available globally for ErrorBoundary
    window.Sentry = Sentry;
  });
};

// Helper function to log errors manually
export const logError = (error, context = {}) => {
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      extra: context
    });
  } else {
    console.error('Error:', error, context);
  }
};

// Helper function to log messages
export const logMessage = (message, level = 'info', context = {}) => {
  if (window.Sentry) {
    window.Sentry.captureMessage(message, {
      level,
      extra: context
    });
  } else {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }
};

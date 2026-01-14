/**
 * Error Utilities
 * Centralized error handling utilities
 */

/**
 * Extract user-friendly error message from error object
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An error occurred';
  
  if (typeof error === 'string') {
    return error;
  }

  // Check for custom error type
  if (error?.type) {
    switch (error.type) {
      case 'network':
        return 'Network error. Please check your connection.';
      case 'auth':
        return 'Authentication required. Please sign in.';
      case 'permission':
        return 'You do not have permission to perform this action.';
      case 'not_found':
        return 'Resource not found.';
      case 'rate_limit':
        return 'Too many requests. Please try again later.';
      case 'server':
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  // Check for axios error
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for standard error message
  if (error?.message) {
    return error.message;
  }

  return 'An error occurred. Please try again.';
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error) => {
  if (!error) return false;

  // Network errors are retryable
  if (error?.type === 'network') return true;
  
  // Server errors (5xx) are retryable
  if (error?.status >= 500 && error?.status < 600) return true;
  
  // Rate limit errors are retryable after delay
  if (error?.type === 'rate_limit') return true;

  return false;
};

/**
 * Get retry delay for rate limit errors
 */
export const getRetryDelay = (error) => {
  if (error?.type === 'rate_limit' && error?.retryAfter) {
    return error.retryAfter * 1000; // Convert to milliseconds
  }
  return 1000; // Default 1 second
};

/**
 * Format error for logging
 */
export const formatErrorForLogging = (error) => {
  return {
    message: getErrorMessage(error),
    type: error?.type || 'unknown',
    status: error?.status,
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  };
};

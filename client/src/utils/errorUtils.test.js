/**
 * Error Utils Tests
 */

import { describe, it, expect } from 'vitest';
import {
  getErrorMessage,
  isRetryableError,
  getRetryDelay,
  formatErrorForLogging,
} from './errorUtils';

describe('errorUtils', () => {
  describe('getErrorMessage', () => {
    it('returns string error as-is', () => {
      expect(getErrorMessage('Test error')).toBe('Test error');
    });

    it('handles network error type', () => {
      const error = { type: 'network' };
      expect(getErrorMessage(error)).toContain('Network error');
    });

    it('handles auth error type', () => {
      const error = { type: 'auth' };
      expect(getErrorMessage(error)).toContain('Authentication');
    });

    it('handles permission error type', () => {
      const error = { type: 'permission' };
      expect(getErrorMessage(error)).toContain('permission');
    });

    it('handles not_found error type', () => {
      const error = { type: 'not_found' };
      expect(getErrorMessage(error)).toContain('not found');
    });

    it('handles rate_limit error type', () => {
      const error = { type: 'rate_limit' };
      expect(getErrorMessage(error)).toContain('Too many requests');
    });

    it('handles server error type', () => {
      const error = { type: 'server' };
      expect(getErrorMessage(error)).toContain('Server error');
    });

    it('handles axios error with response data', () => {
      const error = {
        response: {
          data: {
            message: 'Custom error message',
          },
        },
      };
      expect(getErrorMessage(error)).toBe('Custom error message');
    });

    it('handles error with message property', () => {
      const error = { message: 'Error message' };
      expect(getErrorMessage(error)).toBe('Error message');
    });

    it('returns default message for unknown error', () => {
      expect(getErrorMessage({})).toBe('An error occurred. Please try again.');
    });

    it('handles null error', () => {
      expect(getErrorMessage(null)).toBe('An error occurred');
    });
  });

  describe('isRetryableError', () => {
    it('returns true for network errors', () => {
      expect(isRetryableError({ type: 'network' })).toBe(true);
    });

    it('returns true for server errors (5xx)', () => {
      expect(isRetryableError({ status: 500 })).toBe(true);
      expect(isRetryableError({ status: 502 })).toBe(true);
      expect(isRetryableError({ status: 503 })).toBe(true);
    });

    it('returns true for rate limit errors', () => {
      expect(isRetryableError({ type: 'rate_limit' })).toBe(true);
    });

    it('returns false for client errors (4xx)', () => {
      expect(isRetryableError({ status: 400 })).toBe(false);
      expect(isRetryableError({ status: 404 })).toBe(false);
    });

    it('returns false for null error', () => {
      expect(isRetryableError(null)).toBe(false);
    });
  });

  describe('getRetryDelay', () => {
    it('returns retryAfter from rate limit error', () => {
      const error = { type: 'rate_limit', retryAfter: 5 };
      expect(getRetryDelay(error)).toBe(5000);
    });

    it('returns default delay for non-rate-limit errors', () => {
      expect(getRetryDelay({ type: 'network' })).toBe(1000);
    });
  });

  describe('formatErrorForLogging', () => {
    it('formats error correctly', () => {
      const error = {
        type: 'network',
        status: 500,
        message: 'Test error',
        stack: 'Error stack',
      };
      
      const formatted = formatErrorForLogging(error);
      
      expect(formatted.message).toBe('Network error. Please check your connection.');
      expect(formatted.type).toBe('network');
      expect(formatted.status).toBe(500);
      expect(formatted.stack).toBe('Error stack');
      expect(formatted.timestamp).toBeDefined();
    });
  });
});

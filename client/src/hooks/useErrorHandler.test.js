/**
 * useErrorHandler Hook Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock Sentry
global.window = {
  Sentry: {
    captureException: vi.fn(),
  },
};

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns handleError function', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.handleError).toBeDefined();
    expect(typeof result.current.handleError).toBe('function');
  });

  it('handles string error', () => {
    const { toast } = require('react-toastify');
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError('Test error');
    });
    
    expect(toast.error).toHaveBeenCalledWith('Test error', expect.any(Object));
  });

  it('handles error object with type', () => {
    const { toast } = require('react-toastify');
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError({ type: 'network' });
    });
    
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('Network error'),
      expect.any(Object)
    );
  });

  it('calls custom error handler when provided', () => {
    const customHandler = vi.fn();
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError('Error', { onError: customHandler });
    });
    
    expect(customHandler).toHaveBeenCalled();
  });

  it('logs to Sentry in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');
    
    act(() => {
      result.current.handleError(error, { logToSentry: true });
    });
    
    expect(window.Sentry.captureException).toHaveBeenCalled();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('uses custom message when provided', () => {
    const { toast } = require('react-toastify');
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError('Error', { customMessage: 'Custom message' });
    });
    
    expect(toast.error).toHaveBeenCalledWith('Custom message', expect.any(Object));
  });
});

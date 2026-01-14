/**
 * Custom Hook for API Calls
 * Provides loading states, error handling, and request cancellation
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

/**
 * useApi Hook
 * @param {Function} apiFunction - Async function that makes the API call
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to fetch on mount (default: false)
 * @param {Array} options.dependencies - Dependencies for auto-fetch
 * @param {Function} options.onSuccess - Callback on success
 * @param {Function} options.onError - Callback on error
 * @param {boolean} options.optimistic - Enable optimistic updates
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    autoFetch = false,
    dependencies = [],
    onSuccess,
    onError,
    optimistic = false,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cancel ongoing request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async (...args) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args, { signal });
      
      if (!isMountedRef.current) return;

      setData(result);
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      if (!isMountedRef.current) return;

      // Don't set error if request was cancelled
      if (axios.isCancel(err) || err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);

      if (onError) {
        onError(err);
      }
      // Error is handled by onError callback or useErrorHandler

      throw err;
    }
  }, [apiFunction, onSuccess, onError]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, ...dependencies]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * useMutation Hook
 * For POST/PUT/DELETE operations with optimistic updates
 */
export const useMutation = (mutationFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    optimistic = false,
    optimisticUpdate,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const mutate = useCallback(async (...args) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    // Optimistic update
    let rollback = null;
    if (optimistic && optimisticUpdate) {
      rollback = optimisticUpdate(...args);
    }

    try {
      const result = await mutationFunction(...args, { signal });
      
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      // Rollback optimistic update on error
      if (rollback) {
        rollback();
      }

      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);

      if (onError) {
        onError(err);
      }
      // Error is handled by onError callback or useErrorHandler

      throw err;
    }
  }, [mutationFunction, onSuccess, onError, optimistic, optimisticUpdate]);

  return {
    mutate,
    loading,
    error,
  };
};

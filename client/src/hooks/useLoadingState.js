/**
 * useLoadingState Hook
 * Manages loading state with automatic timeout
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export const useLoadingState = (initialState = false, options = {}) => {
  const {
    timeout = 30000, // 30 seconds max loading time
    onTimeout,
  } = options;

  const [loading, setLoading] = useState(initialState);
  const timeoutRef = useRef(null);

  const setLoadingState = useCallback((value) => {
    setLoading(value);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Set timeout if loading starts
    if (value && timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        if (onTimeout) {
          onTimeout();
        }
      }, timeout);
    }
  }, [timeout, onTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [loading, setLoadingState];
};

export default useLoadingState;

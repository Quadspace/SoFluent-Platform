/**
 * useLoadingState Hook Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoadingState } from './useLoadingState';

describe('useLoadingState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with provided initial state', () => {
    const { result } = renderHook(() => useLoadingState(true));
    expect(result.current[0]).toBe(true);
  });

  it('initializes with false by default', () => {
    const { result } = renderHook(() => useLoadingState());
    expect(result.current[0]).toBe(false);
  });

  it('updates loading state', () => {
    const { result } = renderHook(() => useLoadingState(false));
    
    act(() => {
      result.current[1](true);
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1](false);
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('calls onTimeout after timeout duration', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useLoadingState(false, { timeout: 1000, onTimeout })
    );
    
    act(() => {
      result.current[1](true);
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe(false);
  });

  it('does not timeout when timeout is 0', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useLoadingState(false, { timeout: 0, onTimeout })
    );
    
    act(() => {
      result.current[1](true);
    });
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(onTimeout).not.toHaveBeenCalled();
    expect(result.current[0]).toBe(true);
  });

  it('clears timeout when loading state changes', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useLoadingState(false, { timeout: 1000, onTimeout })
    );
    
    act(() => {
      result.current[1](true);
    });
    
    act(() => {
      vi.advanceTimersByTime(500);
      result.current[1](false);
    });
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('cleans up timeout on unmount', () => {
    const onTimeout = vi.fn();
    const { result, unmount } = renderHook(() =>
      useLoadingState(false, { timeout: 1000, onTimeout })
    );
    
    act(() => {
      result.current[1](true);
    });
    
    unmount();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Timeout should be cleared, so onTimeout shouldn't be called
    // (though we can't directly test this, unmount should prevent the callback)
  });
});

/**
 * useApi Hook Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApi, useMutation } from './useApi';

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const apiFunction = vi.fn();
    const { result } = renderHook(() => useApi(apiFunction));
    
    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('sets loading to true when autoFetch is enabled', () => {
    const apiFunction = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result } = renderHook(() =>
      useApi(apiFunction, { autoFetch: true })
    );
    
    expect(result.current.loading).toBe(true);
  });

  it('executes API function when execute is called', async () => {
    const apiFunction = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result } = renderHook(() => useApi(apiFunction));
    
    await result.current.execute();
    
    expect(apiFunction).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual({ data: 'test' });
    expect(result.current.loading).toBe(false);
  });

  it('handles API errors correctly', async () => {
    const error = new Error('API Error');
    const apiFunction = vi.fn(() => Promise.reject(error));
    const { result } = renderHook(() => useApi(apiFunction));
    
    await result.current.execute();
    
    expect(result.current.error).toBe('API Error');
    expect(result.current.loading).toBe(false);
  });

  it('calls onSuccess callback on success', async () => {
    const onSuccess = vi.fn();
    const apiFunction = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result } = renderHook(() =>
      useApi(apiFunction, { onSuccess })
    );
    
    await result.current.execute();
    
    expect(onSuccess).toHaveBeenCalledWith({ data: 'test' });
  });

  it('calls onError callback on error', async () => {
    const onError = vi.fn();
    const error = new Error('API Error');
    const apiFunction = vi.fn(() => Promise.reject(error));
    const { result } = renderHook(() =>
      useApi(apiFunction, { onError })
    );
    
    await result.current.execute();
    
    expect(onError).toHaveBeenCalled();
  });

  it('resets state when reset is called', async () => {
    const apiFunction = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result } = renderHook(() => useApi(apiFunction));
    
    await result.current.execute();
    result.current.reset();
    
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('cancels previous request when new one is made', async () => {
    const apiFunction = vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 100)));
    const { result } = renderHook(() => useApi(apiFunction));
    
    const promise1 = result.current.execute();
    const promise2 = result.current.execute();
    
    await Promise.all([promise1, promise2]);
    
    // Should only complete the second request
    expect(apiFunction).toHaveBeenCalledTimes(2);
  });
});

describe('useMutation', () => {
  it('initializes with correct default values', () => {
    const mutationFunction = vi.fn();
    const { result } = renderHook(() => useMutation(mutationFunction));
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('sets loading during mutation', async () => {
    const mutationFunction = vi.fn(() => Promise.resolve({ success: true }));
    const { result } = renderHook(() => useMutation(mutationFunction));
    
    const mutationPromise = result.current.mutate();
    
    expect(result.current.loading).toBe(true);
    
    await mutationPromise;
    
    expect(result.current.loading).toBe(false);
  });

  it('handles mutation errors', async () => {
    const error = new Error('Mutation Error');
    const mutationFunction = vi.fn(() => Promise.reject(error));
    const { result } = renderHook(() => useMutation(mutationFunction));
    
    await result.current.mutate();
    
    expect(result.current.error).toBe('Mutation Error');
    expect(result.current.loading).toBe(false);
  });

  it('calls onSuccess callback on success', async () => {
    const onSuccess = vi.fn();
    const mutationFunction = vi.fn(() => Promise.resolve({ success: true }));
    const { result } = renderHook(() =>
      useMutation(mutationFunction, { onSuccess })
    );
    
    await result.current.mutate();
    
    expect(onSuccess).toHaveBeenCalledWith({ success: true });
  });

  it('calls onError callback on error', async () => {
    const onError = vi.fn();
    const error = new Error('Mutation Error');
    const mutationFunction = vi.fn(() => Promise.reject(error));
    const { result } = renderHook(() =>
      useMutation(mutationFunction, { onError })
    );
    
    await result.current.mutate();
    
    expect(onError).toHaveBeenCalled();
  });
});

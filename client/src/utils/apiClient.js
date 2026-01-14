/**
 * API Client with Request Interceptors
 * Handles authentication, error handling, and request cancellation
 */

import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from Clerk if available
    if (window.Clerk?.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Failed to get auth token - continue without token
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        type: 'network',
      });
    }

    // Handle specific status codes
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        if (window.Clerk) {
          await window.Clerk.signOut();
        }
        return Promise.reject({
          message: data?.message || 'Authentication required',
          type: 'auth',
          status,
        });

      case 403:
        return Promise.reject({
          message: data?.message || 'You do not have permission to perform this action',
          type: 'permission',
          status,
        });

      case 404:
        return Promise.reject({
          message: data?.message || 'Resource not found',
          type: 'not_found',
          status,
        });

      case 429:
        return Promise.reject({
          message: data?.message || 'Too many requests. Please try again later.',
          type: 'rate_limit',
          status,
          retryAfter: data?.retryAfter,
        });

      case 500:
      case 502:
      case 503:
        return Promise.reject({
          message: data?.message || 'Server error. Please try again later.',
          type: 'server',
          status,
        });

      default:
        return Promise.reject({
          message: data?.message || error.message || 'An error occurred',
          type: 'unknown',
          status,
        });
    }
  }
);

export default apiClient;

/**
 * Test Utilities
 * Helper functions for testing
 */

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AppContextProvider } from '../context/AppContext';

/**
 * Render component with all providers
 */
export const renderWithProviders = (ui, options = {}) => {
  const {
    route = '/',
    ...renderOptions
  } = options;

  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ThemeProvider>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Mock user data
 */
export const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  imageUrl: 'https://example.com/avatar.jpg',
  publicMetadata: {
    role: 'student',
  },
};

/**
 * Mock course data
 */
export const mockCourse = {
  _id: 'course_123',
  courseTitle: 'Test Course',
  courseDescription: 'This is a test course',
  coursePrice: 99,
  courseImage: 'https://example.com/course.jpg',
  courseRatings: [
    { rating: 5, userId: 'user_1' },
    { rating: 4, userId: 'user_2' },
  ],
  courseChapters: [
    {
      chapterId: 'chapter_1',
      chapterTitle: 'Chapter 1',
      chapterContent: [],
    },
  ],
};

/**
 * Wait for async operations
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

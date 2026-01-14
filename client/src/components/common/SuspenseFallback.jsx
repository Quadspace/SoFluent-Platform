/**
 * Suspense Fallback Component
 * Loading state for lazy-loaded components
 */

import React from 'react';
import PageLoader from './PageLoader';

const SuspenseFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <PageLoader message="Loading..." />
    </div>
  );
};

export default SuspenseFallback;

/**
 * Inline Loader Component
 * For loading states within content areas
 */

import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import BrandText from './BrandText';

const InlineLoader = ({ 
  message = 'Loading...', 
  size = 'medium',
  showMessage = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}
    >
      <LoadingSpinner size={size} />
      {showMessage && (
        <BrandText size="sm" color="secondary" className="text-center">
          {message}
        </BrandText>
      )}
    </motion.div>
  );
};

export default InlineLoader;

/**
 * Loading Spinner Component
 * Premium loading animation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 40, color = '#E91E63' }) => {
  return (
    <motion.div
      className="loading-spinner-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Loader2 className="loading-spinner-icon" style={{ width: size, height: size, color }} />
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;

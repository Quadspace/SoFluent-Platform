/**
 * Skeleton Loader Component
 * Premium skeleton loading states
 */

import React from 'react';
import { motion } from 'framer-motion';
import './SkeletonLoader.css';

const SkeletonLoader = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '8px',
  className = ''
}) => {
  return (
    <motion.div
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius }}
      animate={{
        background: [
          'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
          'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)',
          'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)'
        ],
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

export default SkeletonLoader;

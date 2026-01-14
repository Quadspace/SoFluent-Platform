/**
 * Loading Spinner Component
 * Reusable loading spinner with variants
 */

import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  className = '',
  fullScreen = false 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'border-[#E91E63]',
    secondary: 'border-[#D4AF37]',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  const spinner = (
    <motion.div
      className={`${sizes[size]} ${colors[color]} border-4 border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;

/**
 * Progress Indicator Component
 * Circular and linear progress indicators
 */

import React from 'react';
import { motion } from 'framer-motion';
import './ProgressIndicator.css';

/**
 * Circular Progress Indicator
 */
export const CircularProgress = ({ value = 0, size = 60, strokeWidth = 6, color = '#E91E63' }) => {
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="circular-progress-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      {/* Center text */}
      <div className="circular-progress-text">
        {Math.round(value)}%
      </div>
    </div>
  );
};

/**
 * Linear Progress Indicator
 */
export const LinearProgress = ({ value = 0, height = 8, color = '#E91E63', showLabel = false }) => {
  return (
    <div className="linear-progress-container">
      {showLabel && (
        <div className="linear-progress-label">
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div className="linear-progress-track" style={{ height }}>
        <motion.div
          className="linear-progress-fill"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const ProgressIndicator = ({ type = 'circular', ...props }) => {
  if (type === 'linear') {
    return <LinearProgress {...props} />;
  }
  return <CircularProgress {...props} />;
};

export default ProgressIndicator;

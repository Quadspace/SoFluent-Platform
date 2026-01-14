/**
 * Error Animation Component
 * Premium error handling with shake animation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import './ErrorAnimation.css';

const ErrorAnimation = ({ 
  show = false, 
  message = 'An error occurred',
  onDismiss
}) => {
  return (
    <motion.div
      className="error-animation"
      initial={{ opacity: 0, x: -100 }}
      animate={show ? { 
        opacity: 1, 
        x: 0,
        scale: [1, 1.05, 1]
      } : { opacity: 0, x: -100 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25
      }}
    >
      <motion.div
        className="error-icon"
        animate={show ? {
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{
          duration: 0.5,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }}
      >
        <AlertCircle className="w-6 h-6 text-red-500" />
      </motion.div>
      
      <p className="error-message">{message}</p>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="error-dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default ErrorAnimation;

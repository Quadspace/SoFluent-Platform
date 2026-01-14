/**
 * Micro Animations Library
 * Premium UX: Reusable animation components for loading, success, and error states
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Loading Spinner Component
 * Multiple variants for different contexts
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'cherry',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    cherry: 'border-[#E91E63]',
    gold: 'border-[#D4AF37]',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <motion.div
        className={`w-full h-full border-4 ${colorClasses[color]} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

/**
 * Skeleton Loader Component
 * For content placeholders
 */
export const SkeletonLoader = ({ 
  width = 'w-full', 
  height = 'h-4',
  className = '',
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded ${className}`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1
          }}
        />
      ))}
    </>
  );
};

/**
 * Success Animation Component
 * Celebratory success feedback
 */
export const SuccessAnimation = ({ 
  message = 'Success!',
  showIcon = true,
  size = 'md',
  onComplete 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  React.useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
    >
      {showIcon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </motion.div>
      )}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`${sizeClasses[size]} font-semibold text-green-800 dark:text-green-200`}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

/**
 * Error Animation Component
 * Shake animation for errors
 */
export const ErrorAnimation = ({ 
  message = 'An error occurred',
  showIcon = true,
  size = 'md',
  onComplete 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  React.useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: 1, 
          x: [0, -10, 10, -10, 10, 0] // Shake animation
        }}
      transition={{ 
        x: { duration: 0.5 },
        opacity: { duration: 0.2 }
      }}
      className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
    >
      {showIcon && (
        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      )}
      <p className={`${sizeClasses[size]} font-semibold text-red-800 dark:text-red-200`}>
        {message}
      </p>
    </motion.div>
  );
};

/**
 * Warning Animation Component
 * Subtle pulse for warnings
 */
export const WarningAnimation = ({ 
  message = 'Warning',
  showIcon = true,
  size = 'md',
  onComplete 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  React.useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: [1, 1.02, 1] // Pulse animation
      }}
      transition={{ 
        scale: { duration: 2, repeat: Infinity },
        opacity: { duration: 0.2 }
      }}
      className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
    >
      {showIcon && (
        <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
      )}
      <p className={`${sizeClasses[size]} font-semibold text-yellow-800 dark:text-yellow-200`}>
        {message}
      </p>
    </motion.div>
  );
};

/**
 * Confetti Success Animation
 * Celebratory confetti effect
 */
export const ConfettiSuccess = ({ onComplete }) => {
  const confettiColors = ['#E91E63', '#D4AF37', '#00BCD4', '#4CAF50', '#FF9800'];
  
  React.useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            top: '-10%'
          }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: 360,
            opacity: [1, 1, 0],
            x: (Math.random() - 0.5) * 200
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 0.5,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Progress Bar Component
 * Animated progress indicator
 */
export const ProgressBar = ({ 
  progress = 0, 
  color = 'cherry',
  showLabel = false,
  className = '' 
}) => {
  const colorClasses = {
    cherry: 'bg-gradient-to-r from-[#E91E63] to-[#C2185B]',
    gold: 'bg-gradient-to-r from-[#D4AF37] to-[#B8941A]',
    blue: 'bg-gradient-to-r from-[#00BCD4] to-[#0097A7]',
    green: 'bg-gradient-to-r from-[#4CAF50] to-[#388E3C]'
  };

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        className={`h-full ${colorClasses[color]}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      {showLabel && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

/**
 * Pulse Animation Component
 * For attention-grabbing elements
 */
export const PulseAnimation = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Fade In Animation Wrapper
 * Simple fade-in for any content
 */
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Slide In Animation Wrapper
 * Slide from direction
 */
export const SlideIn = ({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '' 
}) => {
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Toast Notification System
 * Animated toast notifications
 */
export const ToastNotification = ({ 
  type = 'info',
  message,
  isVisible,
  onClose,
  duration = 3000 
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={`fixed top-4 right-4 ${config.bg} ${config.border} border rounded-xl p-4 shadow-lg z-50 max-w-md`}
        >
          <div className="flex items-start gap-3">
            {config.icon}
            <div className="flex-1">
              <p className={`${config.text} font-semibold`}>{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default {
  LoadingSpinner,
  SkeletonLoader,
  SuccessAnimation,
  ErrorAnimation,
  WarningAnimation,
  ConfettiSuccess,
  ProgressBar,
  PulseAnimation,
  FadeIn,
  SlideIn,
  ToastNotification
};
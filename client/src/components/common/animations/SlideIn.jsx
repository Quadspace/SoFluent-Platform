/**
 * Slide In Animation
 * Slide-in entrance animation
 */

import React from 'react';
import { motion } from 'framer-motion';

const SlideIn = ({ 
  children, 
  direction = 'up', // 'up', 'down', 'left', 'right'
  delay = 0,
  duration = 0.5
}) => {
  const variants = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;

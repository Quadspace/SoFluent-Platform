/**
 * Scale In Animation
 * Scale-in entrance animation
 */

import React from 'react';
import { motion } from 'framer-motion';

const ScaleIn = ({ children, delay = 0, duration = 0.5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay, 
        duration,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;

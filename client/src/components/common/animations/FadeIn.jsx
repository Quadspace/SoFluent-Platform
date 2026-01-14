/**
 * Fade In Animation
 * Simple fade-in entrance animation
 */

import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, duration = 0.5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;

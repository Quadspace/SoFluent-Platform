/**
 * Success Animation Component
 * Premium celebration animations for successful actions
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, Sparkles } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';
import './SuccessAnimation.css';

const SuccessAnimation = ({ 
  show = false, 
  message = 'Success!',
  type = 'default', // 'default', 'achievement', 'streak', 'completion'
  onComplete
}) => {
  useEffect(() => {
    if (show) {
      // Trigger confetti based on type
      switch (type) {
        case 'achievement':
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E91E63', '#FF6B9D', '#D4AF37']
          });
          break;
        case 'streak':
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FF6B9D', '#E91E63']
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FF6B9D', '#E91E63']
          });
          break;
        case 'completion':
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#10B981', '#34D399', '#6EE7B7']
          });
          break;
        default:
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
      }
      
      // Haptic feedback (mobile)
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
      }
      
      // Sound effect
      if (type === 'achievement') {
        soundEffects.achievement();
      } else if (type === 'streak') {
        soundEffects.success();
      } else {
        soundEffects.success();
      }
      
      // Call onComplete after animation
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
  }, [show, type, onComplete]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="success-animation"
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25
          }}
        >
          <motion.div
            className="success-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1
            }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
            <motion.div
              className="success-sparkles"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2" />
              <Sparkles className="w-6 h-6 text-pink-400 absolute -bottom-1 -left-1" />
            </motion.div>
          </motion.div>
          
          <motion.p
            className="success-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation;

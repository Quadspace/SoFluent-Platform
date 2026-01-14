/**
 * Enhanced Celebrations Component
 * Premium celebration animations with multiple types
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import soundEffects from '../../utils/soundEffects';
import { Trophy, Star, Award, Zap, Heart, Sparkles } from 'lucide-react';
import './EnhancedCelebrations.css';

/**
 * Celebration Types
 */
const CELEBRATION_TYPES = {
  achievement: {
    icon: Trophy,
    color: '#D4AF37',
    confetti: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFD700', '#FFA500']
      });
    }
  },
  streak: {
    icon: Zap,
    color: '#FF6B9D',
    confetti: () => {
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
    }
  },
  completion: {
    icon: Award,
    color: '#10B981',
    confetti: () => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#10B981', '#34D399', '#6EE7B7']
      });
    }
  },
  milestone: {
    icon: Star,
    color: '#F59E0B',
    confetti: () => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#FCD34D']
      });
    }
  },
  love: {
    icon: Heart,
    color: '#EC4899',
    confetti: () => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        shapes: ['heart'],
        colors: ['#EC4899', '#F472B6', '#FBCFE8']
      });
    }
  }
};

/**
 * Enhanced Celebration Component
 */
const EnhancedCelebration = ({ 
  show = false, 
  type = 'achievement',
  message = 'Congratulations!',
  subtitle = '',
  onComplete,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const celebration = CELEBRATION_TYPES[type] || CELEBRATION_TYPES.achievement;
  const Icon = celebration.icon;
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Trigger confetti
      celebration.confetti();
      
      // Sound effect
      if (type === 'achievement') {
        soundEffects.achievement();
      } else {
        soundEffects.success();
      }
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50, 30, 50]);
      }
      
      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(() => onComplete(), 500);
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, type, duration, onComplete, celebration]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="enhanced-celebration"
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25
          }}
        >
          {/* Background glow */}
          <motion.div
            className="celebration-glow"
            style={{ backgroundColor: celebration.color }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.3 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Icon */}
          <motion.div
            className="celebration-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1
            }}
          >
            <Icon 
              className="w-20 h-20" 
              style={{ color: celebration.color }}
            />
            
            {/* Sparkles */}
            <motion.div
              className="celebration-sparkles"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2" />
              <Sparkles className="w-6 h-6 text-pink-400 absolute -bottom-1 -left-1" />
              <Sparkles className="w-5 h-5 text-blue-400 absolute top-1/2 -right-3" />
            </motion.div>
          </motion.div>
          
          {/* Message */}
          <motion.div
            className="celebration-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="celebration-title">{message}</h3>
            {subtitle && (
              <p className="celebration-subtitle">{subtitle}</p>
            )}
          </motion.div>
          
          {/* Particles */}
          <div className="celebration-particles">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                style={{ backgroundColor: celebration.color }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  opacity: 0,
                  scale: 0
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedCelebration;

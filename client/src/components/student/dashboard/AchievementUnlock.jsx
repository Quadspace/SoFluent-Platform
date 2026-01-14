/**
 * Achievement Unlock Modal Component
 * Celebration animation when student unlocks achievement
 * Key for motivation and engagement
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import Confetti from '../../common/Confetti';

const AchievementUnlock = ({ achievement, onClose }) => {
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => {
    // Trigger confetti when achievement appears
    setConfettiTrigger(prev => prev + 1);
    
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Confetti Celebration */}
        <Confetti trigger={confettiTrigger} type="achievement" />
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative bg-gradient-to-br from-[#D4AF37] via-[#E91E63] to-[#C2185B] rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Achievement Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-4"
          >
            {achievement.icon || '🏆'}
          </motion.div>

          {/* Confetti Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, opacity: 1 }}
                animate={{
                  y: -200,
                  x: (Math.random() - 0.5) * 200,
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
              />
            ))}
          </div>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}
          >
            Achievement Unlocked!
          </motion.h2>

          {/* Achievement Name */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-bold text-white mb-4"
          >
            {achievement.name}
          </motion.p>

          {/* Message */}
          {achievement.message && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/90 text-lg mb-6"
            >
              {achievement.message}
            </motion.p>
          )}

          {/* CTA */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onClose}
            className="bg-white text-[#E91E63] font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Awesome! 🎉
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AchievementUnlock;

/**
 * Daily Challenge Card Component
 * Shows today's challenge - key for daily engagement and retention
 * Drives daily logins and habit formation
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Mic, CheckCircle, Users } from 'lucide-react';
import AnimatedButton from '../../common/AnimatedButton';
import Confetti from '../../common/Confetti';

const DailyChallengeCard = ({ challenge, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [completed, setCompleted] = useState(challenge?.completed || false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  if (!challenge) return null;

  const handleRecord = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setCompleted(true);
      setConfettiTrigger(prev => prev + 1); // Trigger confetti
      if (onComplete) onComplete();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-[#FF6B35]/10 via-[#E91E63]/10 to-[#C2185B]/10 border border-[#FF6B35]/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative"
    >
      {/* Confetti Celebration */}
      {completed && <Confetti trigger={confettiTrigger} type="streak" />}
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#E91E63] flex items-center justify-center">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Today's Challenge</h3>
          <p className="text-sm text-gray-400">Keep your streak alive! 🔥</p>
        </div>
      </div>

      {/* Challenge Content */}
      <div className="mb-6">
        <p className="text-gray-300 mb-4">{challenge.title}</p>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <p className="text-xl md:text-2xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            "{challenge.phrase}"
          </p>
        </div>
      </div>

      {/* Action Button */}
      {completed ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#D4AF37]/20 to-[#E91E63]/20 rounded-xl border border-[#D4AF37]/30"
        >
          <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
          <span className="text-white font-semibold">Challenge Complete! 🎉</span>
        </motion.div>
      ) : (
        <AnimatedButton
          onClick={handleRecord}
          loading={isRecording}
          disabled={isRecording}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isRecording ? (
            <>
              <span>Recording...</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Record Your Answer</span>
            </>
          )}
        </AnimatedButton>
      )}

      {/* Community Stats */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
        <Users className="w-4 h-4" />
        <span>{challenge.completedCount || 18} students completed today!</span>
      </div>
    </motion.div>
  );
};

export default DailyChallengeCard;

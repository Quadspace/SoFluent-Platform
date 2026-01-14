/**
 * Learning Path Card Component
 * Shows current learning path, progress, and next steps
 * Key for retention - shows students their personalized journey
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningPathCard = ({ learningPath, onContinue }) => {
  const navigate = useNavigate();

  if (!learningPath) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Your Learning Path</h3>
            <p className="text-sm text-gray-400">{learningPath.name}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="text-[#E91E63] text-sm font-semibold hover:text-[#C2185B] transition-colors"
        >
          Customize
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Week {learningPath.currentWeek} of {learningPath.totalWeeks}
          </span>
          <span className="text-sm font-bold text-white">
            {learningPath.progress}% Complete
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${learningPath.progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-[#E91E63] to-[#D4AF37] rounded-full"
          />
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
          Next Up
        </h4>
        <div className="space-y-3">
          {learningPath.nextSteps?.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
              onClick={() => {
                if (step.type === 'class') {
                  // Navigate to class - TODO: implement navigation
                } else {
                  // Navigate to lesson
                  navigate('/my-enrollments');
                }
              }}
            >
              <div className="text-2xl">{step.icon}</div>
              <div className="flex-1">
                <div className="text-white font-semibold group-hover:text-[#E91E63] transition-colors">
                  {step.title}
                </div>
                <div className="text-sm text-gray-400">{step.duration}</div>
              </div>
              <Play className="w-5 h-5 text-gray-400 group-hover:text-[#E91E63] transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all flex items-center justify-center gap-2"
      >
        <BookOpen className="w-5 h-5" />
        Continue Learning
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default LearningPathCard;

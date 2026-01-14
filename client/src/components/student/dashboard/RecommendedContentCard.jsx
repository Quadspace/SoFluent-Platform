/**
 * Recommended Content Card Component
 * AI-powered personalized recommendations
 * Key for discovery, engagement, and upsells
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, ArrowRight, Play } from 'lucide-react';

const RecommendedContentCard = ({ recommendations, onSelect }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#E91E63] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Recommended for You</h3>
            <p className="text-sm text-gray-400">AI-powered suggestions</p>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            onClick={() => onSelect && onSelect(rec.id)}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-[#E91E63]/30 transition-all cursor-pointer group"
          >
            {/* Thumbnail Placeholder */}
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#E91E63]/20 to-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
              <Play className="w-8 h-8 text-[#E91E63]" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold mb-1 group-hover:text-[#E91E63] transition-colors truncate">
                {rec.title}
              </h4>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{rec.duration}</span>
                </div>
                <span>•</span>
                <span className="text-[#D4AF37]">{rec.reason}</span>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#E91E63] transition-colors flex-shrink-0" />
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <button className="w-full mt-6 text-center text-[#E91E63] text-sm font-semibold hover:text-[#C2185B] transition-colors flex items-center justify-center gap-2">
        View All Recommendations
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default RecommendedContentCard;

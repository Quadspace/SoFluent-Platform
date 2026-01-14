/**
 * Enhanced Feed Post Component
 * Personalized feed posts with real content
 * Supports lessons, challenges, community posts, and recommendations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Clock,
  Sparkles,
  Users,
  Award
} from 'lucide-react';

const EnhancedFeedPost = ({ post, onLike, onComment, onShare, onSave }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [saved, setSaved] = useState(post.saved || false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) onLike(post.id, !liked);
  };

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) onSave(post.id, !saved);
  };

  const handleComment = () => {
    setShowComments(!showComments);
    if (onComment) onComment(post.id);
  };

  const handleShare = () => {
    if (onShare) onShare(post.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D4AF37] flex items-center justify-center text-white font-bold">
            {post.author?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="font-semibold text-white">{post.author || 'So Fluent'}</div>
            <div className="text-sm text-gray-400">{post.timestamp || '2h ago'}</div>
          </div>
        </div>
        {post.type === 'recommended' && (
          <div className="flex items-center gap-1 px-2 py-1 bg-[#D4AF37]/20 rounded-full">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs text-[#D4AF37] font-semibold">Recommended</span>
          </div>
        )}
      </div>

      {/* Content */}
      {post.image && (
        <div className="relative aspect-video bg-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {post.type === 'lesson' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-8 h-8 text-[#E91E63]" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
        {post.description && (
          <p className="text-gray-300 mb-3">{post.description}</p>
        )}
        
        {/* Metadata */}
        {post.duration && (
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.duration}</span>
            </div>
            {post.level && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{post.level}</span>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        {post.type === 'lesson' && (
          <button className="w-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
            Start Lesson
          </button>
        )}
        {post.type === 'challenge' && (
          <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E91E63] text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
            Accept Challenge
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 border-t border-white/10">
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked ? 'text-[#E91E63]' : 'text-gray-400 hover:text-[#E91E63]'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-semibold">{post.likes || 0}</span>
            </button>
            <button
              onClick={handleComment}
              className="flex items-center gap-2 text-gray-400 hover:text-[#E91E63] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">{post.comments || 0}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-400 hover:text-[#E91E63] transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className={`transition-colors ${
              saved ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-[#D4AF37]'
            }`}
            >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && post.commentsList && (
        <div className="px-4 pb-4 border-t border-white/10">
          <div className="mt-3 space-y-3">
            {post.commentsList.map((comment, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D4AF37] flex items-center justify-center text-white text-xs font-bold">
                  {comment.author?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-white">{comment.author}</div>
                  <div className="text-sm text-gray-300">{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedFeedPost;

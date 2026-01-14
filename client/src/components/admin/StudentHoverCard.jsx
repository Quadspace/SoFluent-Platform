/**
 * Premium Student Hover Card
 * Apple-level hover interaction with zoom animation and circular progress
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as HoverCard from '@radix-ui/react-hover-card';
import { Mail, MessageCircle, Eye, TrendingUp, Calendar, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Circular Progress Component
 * Animated circular progress indicator
 */
const CircularProgress = ({ value, size = 50 }) => {
  const circumference = 2 * Math.PI * (size / 2 - 4);
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <svg width={size} height={size} className="circular-progress">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 4}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="4"
      />
      
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 4}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#FF6B9D" />
        </linearGradient>
      </defs>
      
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold fill-white"
      >
        {value}%
      </text>
    </svg>
  );
};

/**
 * Format relative time (e.g., "2h ago", "3 days ago")
 */
const formatRelativeTime = (date) => {
  if (!date) return 'Never';
  
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
};

/**
 * Premium Student Hover Card Component
 * Shows beautiful zoom-in card on hover with stats and quick actions
 */
const StudentHoverCard = ({ student, children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Calculate progress percentage
  const progress = student.progress || 0;
  const attendance = student.attendance || { attended: 0, total: 0 };
  const streak = student.streak || 0;
  const subscriptionTier = student.subscription?.tier || 'free';
  
  const handleMessage = (e) => {
    e.stopPropagation();
    // TODO: Open message modal
    // Navigate to messaging or open modal
  };
  
  const handleViewProfile = (e) => {
    e.stopPropagation();
    navigate(`/admin/students/${student.id}`);
  };
  
  return (
    <HoverCard.Root 
      openDelay={200} 
      closeDelay={100} 
      onOpenChange={setIsOpen}
    >
      <HoverCard.Trigger asChild>
        {children}
      </HoverCard.Trigger>
      
      <AnimatePresence>
        {isOpen && (
          <HoverCard.Portal>
            <HoverCard.Content
              side="right"
              align="start"
              sideOffset={10}
              asChild
            >
              <motion.div
                className="student-hover-card"
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30
                }}
              >
                {/* Header with photo */}
                <div className="hover-card-header">
                  <motion.img 
                    src={student.avatar || student.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=E91E63&color=fff`}
                    alt={student.name}
                    className="hover-card-avatar"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                  />
                  <div>
                    <h3 className="hover-card-name">{student.name}</h3>
                    <span className={`tier-badge tier-${subscriptionTier}`}>
                      {subscriptionTier === 'vip' && '⭐ '}
                      {subscriptionTier.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="hover-card-stats">
                  <div className="stat-row">
                    <span className="stat-label">Progress</span>
                    <div className="progress-container">
                      <CircularProgress value={progress} size={50} />
                    </div>
                  </div>
                  
                  <div className="stat-row">
                    <span className="stat-label">Attendance</span>
                    <span className="stat-value">
                      {attendance.attended}/{attendance.total} ✓
                    </span>
                  </div>
                  
                  <div className="stat-row">
                    <span className="stat-label">Last active</span>
                    <span className="stat-value">{formatRelativeTime(student.lastActivityAt || student.updatedAt)}</span>
                  </div>
                  
                  {streak > 0 && (
                    <div className="stat-row">
                      <span className="stat-label">Streak</span>
                      <span className="stat-value">
                        {streak} days <Flame className="inline w-4 h-4 text-orange-500" />
                      </span>
                    </div>
                  )}
                  
                  {student.email && (
                    <div className="stat-row">
                      <span className="stat-label">Email</span>
                      <span className="stat-value text-xs truncate max-w-[200px]">{student.email}</span>
                    </div>
                  )}
                </div>
                
                {/* Quick Actions */}
                <div className="hover-card-actions">
                  <motion.button
                    className="btn-sm btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMessage}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </motion.button>
                  
                  <motion.button
                    className="btn-sm btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewProfile}
                  >
                    <Eye className="w-4 h-4" />
                    View Profile
                  </motion.button>
                </div>
                
                <HoverCard.Arrow className="hover-card-arrow" />
              </motion.div>
            </HoverCard.Content>
          </HoverCard.Portal>
        )}
      </AnimatePresence>
    </HoverCard.Root>
  );
};

export default StudentHoverCard;

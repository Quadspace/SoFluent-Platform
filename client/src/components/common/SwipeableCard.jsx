/**
 * Swipeable Card Component
 * Premium mobile interaction: Swipe left/right to reveal actions
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, Bookmark, Share2, X } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';
import './SwipeableCard.css';

/**
 * Swipeable Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {Function} props.onSwipeRight - Callback when swiped right
 * @param {Function} props.onSwipeLeft - Callback when swiped left
 * @param {Object} props.rightAction - Right action config { icon, label, color }
 * @param {Object} props.leftAction - Left action config { icon, label, color }
 * @param {boolean} props.disabled - Disable swiping
 */
const SwipeableCard = ({ 
  children, 
  onSwipeRight, 
  onSwipeLeft,
  rightAction = { icon: Check, label: 'Complete', color: '#10B981' },
  leftAction = { icon: Bookmark, label: 'Save', color: '#3B82F6' },
  disabled = false
}) => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Transform x position to background color opacity
  const rightActionOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftActionOpacity = useTransform(x, [0, -100], [0, 1]);
  
  // Transform x position to scale for visual feedback
  const cardScale = useTransform(x, [-150, 0, 150], [0.95, 1, 0.95]);
  
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    if (disabled) {
      x.set(0);
      return;
    }
    
    const threshold = 100;
    
    if (info.offset.x > threshold && onSwipeRight) {
      // Swipe right action
      onSwipeRight();
      
      // Animate card off screen
      x.set(500);
      
      // Haptic feedback (mobile)
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 20, 10]);
      }
      
      // Sound effect
      soundEffects.swipe();
      
      // Reset after animation
      setTimeout(() => x.set(0), 300);
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      // Swipe left action
      onSwipeLeft();
      
      // Animate card off screen
      x.set(-500);
      
      // Haptic feedback (mobile)
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 20, 10]);
      }
      
      // Sound effect
      soundEffects.swipe();
      
      // Reset after animation
      setTimeout(() => x.set(0), 300);
    } else {
      // Snap back to center
      x.set(0);
    }
  };
  
  const RightIcon = rightAction.icon || Check;
  const LeftIcon = leftAction.icon || Bookmark;
  
  return (
    <div className="swipeable-container relative">
      {/* Right action background */}
      <motion.div 
        className="swipe-action swipe-action-right"
        style={{ 
          opacity: rightActionOpacity,
          backgroundColor: rightAction.color
        }}
      >
        <RightIcon className="w-8 h-8 text-white" />
        <span className="swipe-label">{rightAction.label}</span>
      </motion.div>
      
      {/* Left action background */}
      <motion.div 
        className="swipe-action swipe-action-left"
        style={{ 
          opacity: leftActionOpacity,
          backgroundColor: leftAction.color
        }}
      >
        <LeftIcon className="w-8 h-8 text-white" />
        <span className="swipe-label">{leftAction.label}</span>
      </motion.div>
      
      {/* Swipeable card */}
      <motion.div
        className="swipeable-card"
        style={{ 
          x,
          scale: cardScale
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        animate={{
          x: isDragging ? undefined : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableCard;

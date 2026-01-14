/**
 * Skeleton Loader Component
 * Top 1% Enhancement: Engaging loading states
 */

import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const shimmer = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  };

  const CardSkeleton = () => (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 overflow-hidden">
      <div className="relative h-4 bg-white/10 rounded-lg mb-4 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      </div>
      <div className="relative h-3 bg-white/10 rounded-lg w-3/4 mb-2 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      </div>
      <div className="relative h-3 bg-white/10 rounded-lg w-1/2 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="relative w-12 h-12 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmer}
              initial="initial"
              animate="animate"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="relative h-4 bg-white/10 rounded-lg w-3/4 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="relative h-3 bg-white/10 rounded-lg w-1/2 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TextSkeleton = () => (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="relative h-4 bg-white/10 rounded-lg overflow-hidden" style={{ width: i === count - 1 ? '60%' : '100%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
      ))}
    </div>
  );

  const CourseDetailsSkeleton = () => (
    <div className="flex md:flex-row flex-col-reverse gap-10">
      {/* Left Column */}
      <div className="max-w-xl flex-1">
        <div className="relative h-12 bg-white/10 rounded-lg mb-4 overflow-hidden" style={{ width: '80%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="relative h-4 bg-white/10 rounded-lg mb-2 overflow-hidden" style={{ width: '100%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="relative h-4 bg-white/10 rounded-lg mb-2 overflow-hidden" style={{ width: '90%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="relative h-4 bg-white/10 rounded-lg mb-6 overflow-hidden" style={{ width: '70%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        
        {/* Course Structure */}
        <div className="relative h-6 bg-white/10 rounded-lg mb-4 overflow-hidden" style={{ width: '40%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg mb-2 p-4">
            <div className="relative h-12 bg-white/10 rounded-lg overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Right Column */}
      <div className="max-w-[420px]">
        <div className="relative h-60 bg-white/10 rounded-lg mb-4 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="relative h-8 bg-white/10 rounded-lg mb-2 overflow-hidden" style={{ width: '60%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="relative h-4 bg-white/10 rounded-lg mb-4 overflow-hidden" style={{ width: '80%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="relative h-12 bg-white/10 rounded-lg overflow-hidden" style={{ width: '100%' }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
          />
        </div>
      </div>
    </div>
  );

  const types = {
    card: CardSkeleton,
    list: ListSkeleton,
    text: TextSkeleton,
    'course-details': CourseDetailsSkeleton
  };

  const Component = types[type] || CardSkeleton;

  return (
    <div className={className}>
      <Component />
    </div>
  );
};

export default SkeletonLoader;

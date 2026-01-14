/**
 * Parallax Component
 * Premium parallax scrolling effects
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Parallax.css';

/**
 * Parallax Container Component
 * Creates a parallax scrolling container
 */
export const ParallaxContainer = ({ children, className = '' }) => {
  return (
    <div className={`parallax-container ${className}`}>
      {children}
    </div>
  );
};

/**
 * Parallax Layer Component
 * Individual layer with parallax effect
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Layer content
 * @param {number} props.speed - Parallax speed (0-1, default: 0.5)
 * @param {string} props.direction - 'up' or 'down' (default: 'up')
 * @param {string} props.className - Additional CSS classes
 */
export const ParallaxLayer = ({ 
  children, 
  speed = 0.5, 
  direction = 'up',
  className = '' 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' 
      ? [`${speed * 100}%`, `${-speed * 100}%`]
      : [`${-speed * 100}%`, `${speed * 100}%`]
  );
  
  return (
    <motion.div
      ref={ref}
      className={`parallax-layer ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Parallax Background Component
 * Background with parallax effect
 */
export const ParallaxBackground = ({ 
  children, 
  speed = 0.3,
  className = '' 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 50}%`, `${-speed * 50}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  
  return (
    <motion.div
      ref={ref}
      className={`parallax-background ${className}`}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Parallax Text Component
 * Text with parallax effect
 */
export const ParallaxText = ({ 
  children, 
  speed = 0.2,
  className = '' 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 30}%`, `${-speed * 30}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  return (
    <motion.div
      ref={ref}
      className={`parallax-text ${className}`}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Main Parallax Component (default export)
 */
const Parallax = ({ children, speed = 0.5, direction = 'up', className = '' }) => {
  return (
    <ParallaxLayer speed={speed} direction={direction} className={className}>
      {children}
    </ParallaxLayer>
  );
};

export default Parallax;

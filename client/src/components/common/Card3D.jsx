/**
 * 3D Card Component
 * Premium 3D perspective effects with tilt on hover
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * 3D Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {number} props.intensity - Tilt intensity (default: 15)
 * @param {boolean} props.glow - Enable glow effect
 * @param {string} props.glowColor - Glow color
 * @param {string} props.className - Additional CSS classes
 */
const Card3D = ({ 
  children, 
  intensity = 15,
  glow = false,
  glowColor = '#E91E63',
  className = ''
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity]);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  return (
    <motion.div
      ref={ref}
      className={`card-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Glow effect */}
      {glow && isHovered && (
        <motion.div
          className="card-3d-glow"
          style={{
            background: `radial-gradient(circle at center, ${glowColor}20, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Card content */}
      <div className="card-3d-content" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
      
      {/* Reflection effect */}
      {isHovered && (
        <motion.div
          className="card-3d-reflection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default Card3D;

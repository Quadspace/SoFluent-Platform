/**
 * Animated Button Component
 * Top 1% Enhancement: Premium micro-interactions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white hover:shadow-lg hover:shadow-[#E91E63]/50',
    secondary: 'bg-gradient-to-r from-[#D4AF37] to-[#E91E63] text-white hover:shadow-lg hover:shadow-[#D4AF37]/50',
    outline: 'border-2 border-[#E91E63] text-[#E91E63] hover:bg-[#E91E63]/10',
    ghost: 'text-[#E91E63] hover:bg-[#E91E63]/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-semibold rounded-lg
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{ width: 300, height: 300, x: ripple.x - 150, y: ripple.y - 150, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
};

export default AnimatedButton;

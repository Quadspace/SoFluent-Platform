/**
 * Brand Card Component
 * Consistent card styling using brand colors
 */

import { motion } from 'framer-motion';

const BrandCard = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'rounded-xl transition-all';
  
  const variants = {
    default: 'bg-white border border-sofluent-gris/20 shadow-md',
    dark: 'bg-sofluent-dark border border-white/10 shadow-lg',
    gradient: 'bg-gradient-to-br from-sofluent-dark to-sofluent-black border border-sofluent-cherry/20 shadow-glow-sm',
    outlined: 'bg-transparent border-2 border-sofluent-cherry/30',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  if (onClick) {
    return (
      <motion.div
        onClick={onClick}
        className={classes}
        whileHover={hover ? { scale: 1.02 } : {}}
        whileTap={hover ? { scale: 0.98 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default BrandCard;

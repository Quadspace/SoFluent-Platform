/**
 * Brand Button Component
 * Theme-aware button styling using CSS variables
 */

import { motion } from 'framer-motion';
import LoadingButton from './LoadingButton';

const BrandButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-sofluent-cherry to-sofluent-cherry-dark text-white hover:shadow-glow focus:ring-sofluent-cherry',
    secondary: 'bg-transparent border-2 border-sofluent-cherry text-sofluent-cherry hover:bg-sofluent-cherry hover:text-white focus:ring-sofluent-cherry',
    accent: 'bg-gradient-to-r from-sofluent-gold to-sofluent-gold-dark text-sofluent-black hover:shadow-lg focus:ring-sofluent-gold',
    ghost: 'bg-transparent text-sofluent-cherry hover:bg-sofluent-cherry/10 focus:ring-sofluent-cherry',
    dark: 'bg-sofluent-dark text-white hover:bg-sofluent-black focus:ring-sofluent-cherry',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (loading) {
    return (
      <LoadingButton
        loading={loading}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        className={className}
        {...props}
      >
        {children}
      </LoadingButton>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default BrandButton;

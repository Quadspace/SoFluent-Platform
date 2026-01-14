/**
 * Input Component
 * Reusable form input component
 * Part of global architecture - use everywhere for inputs
 */

import React from 'react';
import { designTokens } from '../../design-system/designTokens';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  success = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeMap = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const baseClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${sizeMap[size]}
    rounded-lg
    border-2
    transition-all
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : success
    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
    : 'border-gray-300 focus:border-sofluent-cherry focus:ring-sofluent-cherry';

  const classes = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classes}
      {...props}
    />
  );
};

export default Input;

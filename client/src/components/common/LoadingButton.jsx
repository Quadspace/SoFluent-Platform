/**
 * Loading Button Component
 * Button with built-in loading state and spinner
 */

import { useState } from 'react';
import './LoadingButton.css';

const LoadingButton = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleClick = async (e) => {
    if (disabled || loading || internalLoading) return;

    if (onClick) {
      setInternalLoading(true);
      try {
        await onClick(e);
      } finally {
        setInternalLoading(false);
      }
    }
  };

  const isLoading = loading || internalLoading;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`loading-button loading-button--${variant} loading-button--${size} ${fullWidth ? 'loading-button--full-width' : ''} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="loading-button__spinner" aria-hidden="true">
          <svg
            className="loading-button__spinner-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="loading-button__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 32;16 16;0 32;0 32"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-16;-32;-32"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      <span className={`loading-button__content ${isLoading ? 'loading-button__content--loading' : ''}`}>
        {children}
      </span>
    </button>
  );
};

export default LoadingButton;

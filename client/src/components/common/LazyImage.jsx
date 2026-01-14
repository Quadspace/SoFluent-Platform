/**
 * Lazy Image Component
 * Loads images only when they enter the viewport
 */

import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import InlineLoader from './InlineLoader';
import './LazyImage.css';

const LazyImage = ({
  src,
  alt,
  placeholder,
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver();

  // Load image when it enters viewport
  useEffect(() => {
    if (hasIntersected && src && imageSrc !== src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
        if (onLoad) onLoad();
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        if (onError) onError();
      };
      img.src = src;
    }
  }, [hasIntersected, src, imageSrc, onLoad, onError]);

  return (
    <div
      ref={elementRef}
      className={`lazy-image ${isLoading ? 'lazy-image--loading' : ''} ${hasError ? 'lazy-image--error' : ''} ${className}`}
      {...props}
    >
      {isLoading && !hasError && (
        <div className="lazy-image__loader">
          <InlineLoader size="medium" color="gray" />
        </div>
      )}
      {hasError && (
        <div className="lazy-image__error">
          <span>Failed to load image</span>
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className="lazy-image__img"
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      )}
    </div>
  );
};

export default LazyImage;

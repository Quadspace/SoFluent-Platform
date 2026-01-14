/**
 * Image Optimizer Component
 * Automatically serves WebP when supported, falls back to original
 */

import { useState, useEffect } from 'react';

const ImageOptimizer = ({
  src,
  webpSrc,
  alt,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [supportsWebP, setSupportsWebP] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    // Check WebP support
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    setSupportsWebP(checkWebPSupport());
  }, []);

  useEffect(() => {
    // Use WebP if supported and available
    if (supportsWebP && webpSrc) {
      setImageSrc(webpSrc);
    } else {
      setImageSrc(src);
    }
  }, [supportsWebP, webpSrc, src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      {...props}
    />
  );
};

export default ImageOptimizer;

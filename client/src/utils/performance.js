/**
 * Performance Utilities
 * Helper functions for performance optimization
 */

/**
 * Lazy load images
 */
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
  }
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Preload critical resources
 */
export const preloadResource = (href, as, crossorigin = false) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
};

/**
 * Prefetch resources
 */
export const prefetchResource = (href) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

/**
 * Measure performance
 */
export const measurePerformance = {
  /**
   * Measure function execution time
   */
  measureFunction: (name, fn) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      // Performance logging - use proper logging service in production
      if (window.Sentry) {
        window.Sentry.addBreadcrumb({
          category: 'performance',
          message: `${name}: ${(end - start).toFixed(2)}ms`,
          level: 'info',
        });
      }
      return result;
    }
    return fn();
  },

  /**
   * Get performance metrics
   */
  getMetrics: () => {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    }
    return null;
  },
};

/**
 * Optimize images
 */
export const optimizeImage = (src, width, quality = 80) => {
  // If using Cloudinary or similar service, add optimization parameters
  if (src.includes('cloudinary.com')) {
    return `${src}?w=${width}&q=${quality}&f=auto`;
  }
  return src;
};

/**
 * Code splitting utilities
 */
export const codeSplitting = {
  /**
   * Lazy load component
   */
  lazyLoad: (importFn) => {
    return importFn().then(module => module.default || module);
  },
};

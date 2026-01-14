/**
 * Analytics Utility
 * Centralized analytics tracking
 */

// Initialize analytics
export const initAnalytics = () => {
  // Google Analytics 4
  if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);

    window.gtag = gtag;
  }
};

// Track page view
export const trackPageView = (path, title) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Track event
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track conversion
export const trackConversion = (conversionId, value, currency = 'BRL') => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });
  }
};

// Track course enrollment
export const trackCourseEnrollment = (courseId, courseName, price) => {
  trackEvent('course_enrollment', {
    course_id: courseId,
    course_name: courseName,
    value: price,
    currency: 'BRL',
  });
};

// Track payment
export const trackPayment = (paymentMethod, amount, currency = 'BRL') => {
  trackEvent('purchase', {
    payment_method: paymentMethod,
    value: amount,
    currency: currency,
  });
};

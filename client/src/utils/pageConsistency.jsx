/**
 * Page Consistency Utilities
 * Ensures all pages follow the same patterns
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import SkeletonLoader from '../components/common/SkeletonLoader';
import PageLoader from '../components/common/PageLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import Footer from '../components/student/Footer';
import SEOHead from '../components/seo/SEOHead';
import { getSEOData } from '../config/seoConfig';

/**
 * Hook to ensure consistent page structure
 */
export const usePageConsistency = (options = {}) => {
  const {
    showNavbar = true,
    showFooter = true,
    seoTitle,
    seoDescription,
  } = options;

  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return {
    showNavbar,
    showFooter,
    seoTitle,
    seoDescription,
  };
};

/**
 * Standard page wrapper with loading and error states
 */
export const StandardPage = ({
  children,
  loading = false,
  error = null,
  showNavbar = true,
  showFooter = true,
  seoTitle,
  seoDescription,
  seoKeywords,
  seoImage,
  seoPage,
  seoData,
  background = 'bg-white',
  className = '',
}) => {
  const location = useLocation();
  
  // Get SEO data from config if seoPage is provided
  const seoConfig = seoPage ? getSEOData(seoPage, seoData || {}) : null;
  
  // Use provided SEO props or fall back to config
  const finalSeoTitle = seoTitle || seoConfig?.title || 'So Fluent - English Learning Platform';
  const finalSeoDescription = seoDescription || seoConfig?.description || 'Learn English with personalized courses, live classes, and AI-powered learning.';
  const finalSeoKeywords = seoKeywords || seoConfig?.keywords || 'english learning, online courses, english classes';
  const finalSeoImage = seoImage || seoConfig?.image || '/og-image.jpg';
  const robots = seoConfig?.robots || 'index, follow';
  if (loading) {
    return (
      <PageLayout
        showNavbar={showNavbar}
        showFooter={showFooter}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        background={background}
      >
        <div className="min-h-screen flex items-center justify-center">
          <PageLoader message="Loading..." />
        </div>
      </PageLayout>
    );
  }

      if (error) {
        return (
          <PageLayout
            showNavbar={showNavbar}
            showFooter={showFooter}
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            background={background}
          >
            <div className="min-h-screen flex items-center justify-center p-4">
              <ErrorDisplay 
                error={error} 
                variant="default"
                showActions={true}
                className="max-w-md"
              />
            </div>
          </PageLayout>
        );
      }

  return (
    <>
      <SEOHead
        title={finalSeoTitle}
        description={finalSeoDescription}
        keywords={finalSeoKeywords}
        image={finalSeoImage}
        url={`${window.location.origin}${location.pathname}`}
      />
      <PageLayout
        showNavbar={showNavbar}
        showFooter={false} // We'll add Footer manually if needed
        seoTitle={finalSeoTitle}
        seoDescription={finalSeoDescription}
        background={background}
        className={className}
      >
        {children}
        {showFooter && <Footer />}
      </PageLayout>
    </>
  );
};

/**
 * Standard section wrapper
 */
export const StandardSection = ({
  children,
  background = 'bg-white',
  padding = 'py-20',
  className = '',
}) => {
  return (
    <section className={`${background} ${padding} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

/**
 * Standard container wrapper
 */
export default StandardPage;

export const StandardContainer = ({
  children,
  maxWidth = 'max-w-7xl',
  padding = 'px-4 sm:px-6 lg:px-8',
  className = '',
}) => {
  return (
    <div className={`${maxWidth} mx-auto ${padding} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Page Layout Component
 * Ensures consistent structure across all pages
 * Includes Navbar, Footer, SEO, Loading, Error states
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../student/Navbar';
import Footer from '../student/Footer';
import SEOHead from '../seo/SEOHead';
import SkipToContent from '../common/SkipToContent';
import ErrorBoundary from '../common/ErrorBoundary';
import { trackPageView } from '../../utils/analytics';

const PageLayout = ({
  children,
  showNavbar = true,
  showFooter = true,
  seoTitle,
  seoDescription,
  seoImage,
  className = '',
  background = 'bg-white',
}) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    trackPageView(location.pathname, seoTitle || document.title);
  }, [location.pathname, seoTitle]);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${background} ${className}`}>
        <SkipToContent />
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          image={seoImage}
          url={window.location.origin + location.pathname}
        />
        
        {showNavbar && <Navbar />}
        
        <main id="main-content" className="flex-1">
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default PageLayout;

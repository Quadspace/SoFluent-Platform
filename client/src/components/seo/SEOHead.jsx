/**
 * SEO Head Component
 * Manages meta tags, Open Graph, and structured data
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({
  title = 'So Fluent - English Learning Platform',
  description = 'Learn English with personalized courses, live classes, and AI-powered learning. Join thousands of students improving their English fluency.',
  image = '/og-image.jpg',
  url,
  type = 'website',
  keywords = 'english learning, online courses, english classes, learn english, english fluency',
  author = 'So Fluent',
}) => {
  const location = useLocation();
  const canonicalUrl = url || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('theme-color', 'var(--sofluent-cherry, #E91E63)');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'So Fluent', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Structured data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'So Fluent',
      description: description,
      url: window.location.origin,
      logo: `${window.location.origin}/logo.png`,
      sameAs: [
        'https://www.instagram.com/sofluent',
        'https://www.facebook.com/sofluent',
      ],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '297',
        availability: 'https://schema.org/InStock',
      },
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [title, description, image, canonicalUrl, type, keywords, author]);

  return null;
};

export default SEOHead;

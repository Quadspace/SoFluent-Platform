/**
 * SEO Configuration
 * Centralized SEO metadata for all pages
 */

export const seoConfig = {
  default: {
    title: 'So Fluent - Be Yourself in English. Prosper Globally.',
    description: 'Learn English with personalized courses, live classes, and AI-powered learning. Join thousands of Brazilian students improving their English fluency.',
    keywords: 'english learning, online courses, english classes, learn english, english fluency, brazilian english, english for brazilians, english courses brazil',
    image: '/og-image.jpg',
  },
  home: {
    title: 'So Fluent - Be Yourself in English. Prosper Globally.',
    description: 'Ser fluente é ser você! Seja em português, ou em inglês. Da base à fluência profissional, preparamos brasileiros para viver, trabalhar e prosperar em cenários globais.',
    keywords: 'english learning brazil, english courses brazil, learn english online, english fluency, brazilian english students',
  },
  courses: {
    title: 'English Courses - So Fluent',
    description: 'Browse our comprehensive collection of English courses designed for Brazilian professionals. From beginner to advanced, find the perfect course for your goals.',
    keywords: 'english courses, online english courses, english classes, learn english online, english course catalog',
  },
  courseDetails: {
    title: (courseTitle) => `${courseTitle} - So Fluent`,
    description: (courseDescription) => courseDescription || 'Learn English with this comprehensive course designed for Brazilian professionals.',
  },
  dashboard: {
    title: 'Student Dashboard - So Fluent',
    description: 'Your personalized learning dashboard. Track your progress, access courses, and achieve your English fluency goals.',
    keywords: 'student dashboard, learning dashboard, english learning progress',
  },
  feed: {
    title: 'Learning Feed - So Fluent',
    description: 'Your personalized English learning feed with daily challenges, lessons, and community content.',
    keywords: 'english learning feed, daily challenges, english lessons, learning community',
  },
  pricing: {
    title: 'Pricing - So Fluent',
    description: 'Choose the perfect plan for your English learning journey. Flexible pricing options for students, professionals, and businesses.',
    keywords: 'english course pricing, english learning plans, english course prices, subscription plans',
  },
  about: {
    title: 'About So Fluent - English Learning Platform',
    description: 'Learn about So Fluent, our mission to help Brazilians achieve English fluency, and our innovative approach to language learning.',
    keywords: 'about so fluent, english learning platform, language learning mission',
  },
  contact: {
    title: 'Contact Us - So Fluent',
    description: 'Get in touch with So Fluent. We\'re here to help you on your English learning journey.',
    keywords: 'contact so fluent, english learning support, customer service',
  },
  privacy: {
    title: 'Privacy Policy - So Fluent',
    description: 'So Fluent Privacy Policy. Learn how we protect your personal information and data.',
    keywords: 'privacy policy, data protection, privacy',
  },
  products: {
    title: 'Products - So Fluent',
    description: 'Explore our range of English learning products including courses, challenges, workshops, and more.',
    keywords: 'english learning products, english courses, learning challenges, workshops',
  },
  fluencyFit: {
    title: 'Fluency Fit Academy - So Fluent',
    description: 'Science-backed English learning through fitness. Get fit while improving your English fluency with our innovative program.',
    keywords: 'fluency fit, fitness english learning, workout english, science-backed learning',
  },
  kidsCorner: {
    title: 'Kids Corner - So Fluent',
    description: 'English learning for children. Fun, engaging courses designed specifically for kids.',
    keywords: 'kids english learning, children english courses, english for kids',
  },
  admin: {
    title: 'Admin Dashboard - So Fluent',
    description: 'Admin dashboard for managing the So Fluent platform.',
    robots: 'noindex, nofollow',
  },
  teacher: {
    title: 'Teacher Dashboard - So Fluent',
    description: 'Teacher dashboard for managing classes and students.',
    robots: 'noindex, nofollow',
  },
  educator: {
    title: 'Educator Dashboard - So Fluent',
    description: 'Educator dashboard for course management.',
    robots: 'noindex, nofollow',
  },
};

/**
 * Get SEO metadata for a specific page
 */
export const getSEOData = (page, data = {}) => {
  const pageConfig = seoConfig[page] || seoConfig.default;
  const defaultConfig = seoConfig.default;

  let title = typeof pageConfig.title === 'function' 
    ? pageConfig.title(data.title || data.courseTitle)
    : pageConfig.title || defaultConfig.title;

  let description = pageConfig.description || defaultConfig.description;
  
  // Replace placeholders in description
  if (data.courseDescription) {
    description = description.replace('{description}', data.courseDescription);
  }

  return {
    title,
    description,
    keywords: pageConfig.keywords || defaultConfig.keywords,
    image: pageConfig.image || defaultConfig.image,
    robots: pageConfig.robots || 'index, follow',
    type: pageConfig.type || 'website',
  };
};

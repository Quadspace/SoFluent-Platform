/**
 * So Fluent Testimonials Data
 * 
 * This file contains testimonials with headshot references.
 * After downloading headshots from Google Drive, update the image paths.
 */

import { getHeadshotByIndex } from '../assets/headshots/headshots';

export const soFluentTestimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    role: 'Software Engineer @ Microsoft',
    location: 'São Paulo, Brazil',
    image: getHeadshotByIndex(0), // Will use placeholder until headshots are added
    rating: 5,
    feedback: 'So Fluent transformed my career! The Fluency Fit Academy helped me improve my English while staying healthy. I landed my dream job at Microsoft thanks to the confidence I gained.',
    testimonial: 'I was struggling with English interviews until I found So Fluent. The combination of fitness and language learning made it so much more engaging. Now I\'m working at Microsoft!',
    featured: true
  },
  {
    id: 2,
    name: 'Carlos Oliveira',
    role: 'Product Manager @ Amazon',
    location: 'Rio de Janeiro, Brazil',
    image: getHeadshotByIndex(1),
    rating: 5,
    feedback: 'The science-backed approach really works! I saw improvement in just 3 months. The community support and Heloisa\'s teaching style are incredible.',
    testimonial: 'As a product manager, clear communication is crucial. So Fluent helped me express complex ideas confidently in English. The Fluency Fit workouts kept me energized too!',
    featured: true
  },
  {
    id: 3,
    name: 'Ana Costa',
    role: 'Marketing Director',
    location: 'Belo Horizonte, Brazil',
    image: getHeadshotByIndex(2),
    rating: 5,
    feedback: 'Best investment I\'ve made in my career. The VIP program with 1:1 coaching accelerated my progress significantly.',
    testimonial: 'I needed to improve my English quickly for a promotion. So Fluent\'s personalized approach and expert coaching made all the difference. Highly recommend!',
    featured: true
  },
  {
    id: 4,
    name: 'Roberto Santos',
    role: 'Data Scientist',
    location: 'Brasília, Brazil',
    image: getHeadshotByIndex(3),
    rating: 4.8,
    feedback: 'The workout schedule fits perfectly into my busy life. Learning English while exercising is genius!',
    testimonial: 'I love how So Fluent combines fitness with learning. It\'s efficient and fun. My English has improved dramatically, and I\'m in the best shape of my life.',
    featured: false
  },
  {
    id: 5,
    name: 'Juliana Ferreira',
    role: 'UX Designer',
    location: 'Porto Alegre, Brazil',
    image: getHeadshotByIndex(4),
    rating: 5,
    feedback: 'The community is amazing! I\'ve made friends from all over Brazil while improving my English.',
    testimonial: 'So Fluent isn\'t just a language platform - it\'s a community. The support and encouragement from other members keeps me motivated every day.',
    featured: false
  },
  {
    id: 6,
    name: 'Fernando Alves',
    role: 'Entrepreneur',
    location: 'Curitiba, Brazil',
    image: getHeadshotByIndex(5),
    rating: 4.9,
    feedback: 'The Kids\' Corner is perfect for my daughter. She\'s learning English through games and having fun!',
    testimonial: 'My daughter loves the Kids\' Corner! She\'s learning English naturally through play. As a parent, I appreciate the safe, educational environment.',
    featured: false
  }
];

// Get featured testimonials (for homepage)
export const getFeaturedTestimonials = () => {
  return soFluentTestimonials.filter(t => t.featured);
};

// Get testimonials for Fluency Fit Academy
export const getFluencyFitTestimonials = () => {
  return soFluentTestimonials.filter(t => t.id <= 3); // First 3 are Fluency Fit focused
};

// Get testimonials for Kids' Corner
export const getKidsCornerTestimonials = () => {
  return soFluentTestimonials.filter(t => t.id === 6); // Kids' Corner testimonial
};

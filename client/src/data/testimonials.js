/**
 * So Fluent Testimonials Data
 * 
 * This file contains testimonials with headshot references.
 * Uses optimized professional images from the professional-images folder.
 */

import { getHeadshotByIndex } from '../assets/headshots/headshots';
import { getProfessionalImage } from '../assets/professional-images';

export const soFluentTestimonials = [
  {
    id: 1,
    name: 'Victor Queiroz',
    role: 'Estudante',
    location: 'São Paulo, Brasil',
    image: getProfessionalImage('IMG_9476', 'medium') || getHeadshotByIndex(0),
    rating: 5,
    feedback: 'Adoro o ambiente descontraído das aulas sem perder o propósito, deixa o aprendizado leve.',
    testimonial: 'Adoro o ambiente descontraído das aulas sem perder o propósito, deixa o aprendizado leve.',
    featured: true
  },
  {
    id: 2,
    name: 'Paloma Menezes',
    role: 'Estudante',
    location: 'Rio de Janeiro, Brasil',
    image: getProfessionalImage('IMG_9519', 'medium') || getHeadshotByIndex(1),
    rating: 5,
    feedback: 'Entendi que posso aprender sim inglês de uma forma leve e simples, coisa que sempre achei que seria diferente… As professoras nos deixam a vontade pra falar e nos expressar mesmo que esteja errado, para assim então poder nos mostrar o caminho correto. Obrigada por sua dedicação!',
    testimonial: 'Entendi que posso aprender sim inglês de uma forma leve e simples, coisa que sempre achei que seria diferente… As professoras nos deixam a vontade pra falar e nos expressar mesmo que esteja errado, para assim então poder nos mostrar o caminho correto. Obrigada por sua dedicação!',
    featured: true
  },
  {
    id: 3,
    name: 'Fillipe Leão',
    role: 'Estudante',
    location: 'Belo Horizonte, Brasil',
    image: getProfessionalImage('IMG_9493', 'medium') || getHeadshotByIndex(2),
    rating: 5,
    feedback: 'Desafiador pra mim e ter que memorizar em uma língua bem diferente da que eu estou acostumada, mas não é impossível! Eu tenho aprendido que eu tudo posso naquele que me fortalece! E com pessoas como você e Bruna tudo fica mais fácil!!!',
    testimonial: 'Desafiador pra mim e ter que memorizar em uma língua bem diferente da que eu estou acostumada, mas não é impossível! Eu tenho aprendido que eu tudo posso naquele que me fortalece! E com pessoas como você e Bruna tudo fica mais fácil!!!',
    featured: true
  },
  {
    id: 4,
    name: 'Roberto Santos',
    role: 'Data Scientist',
    location: 'Brasília, Brazil',
    image: getProfessionalImage('IMG_9513', 'medium') || getHeadshotByIndex(3),
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
    image: getProfessionalImage('IMG_9490', 'medium') || getHeadshotByIndex(4),
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
    image: getProfessionalImage('IMG_9448', 'medium') || getHeadshotByIndex(5),
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

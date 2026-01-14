/**
 * Tailwind CSS Configuration
 * Imports theme values from theme.ts to ensure single source of truth
 */

import theme from './src/theme/theme.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors (use CSS variables)
        'sofluent-cherry': 'var(--sofluent-cherry)',
        'sofluent-cherry-dark': 'var(--sofluent-cherry-dark)',
        'sofluent-cherry-light': 'var(--sofluent-cherry-light)',
        'sofluent-gold': 'var(--sofluent-gold)',
        'sofluent-gold-dark': 'var(--sofluent-gold-dark)',
        'sofluent-gold-light': 'var(--sofluent-gold-light)',
        'sofluent-black': 'var(--sofluent-black)',
        'sofluent-dark': 'var(--sofluent-dark)',
        'sofluent-white': 'var(--sofluent-white)',
        'sofluent-gris': 'var(--sofluent-gris)',
        
        // Legacy names for compatibility
        'sofluent-pink': 'var(--sofluent-cherry)',
        'sofluent-accent': 'var(--sofluent-gold)',
        
        // Theme colors (direct access)
        'theme-primary': 'var(--theme-primary)',
        'theme-accent': 'var(--theme-accent)',
        'theme-background': 'var(--theme-background)',
        'theme-backgroundDark': 'var(--theme-backgroundDark)',
        'theme-text': 'var(--theme-text)',
        'theme-textSecondary': 'var(--theme-textSecondary)',
        
        // Text colors
        'text-primary': '#1A1A1A',
        'text-secondary': '#666666',
        'text-light': '#999999',
        'text-white': '#FFFFFF',
        
        // Background colors
        'bg-white': '#FFFFFF',
        'bg-light': '#F8F9FA',
        'bg-gray': '#F5F5F5',
        'bg-dark': '#1A1A1A',
      },
      fontFamily: {
        // Brand fonts from Brand Kit
        'display': ['Actay-Regular', 'HelveticaNeueRoman', 'sans-serif'],
        'body': ['HelveticaNeueRoman', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'actay': ['Actay-Regular', 'sans-serif'],
        'helvetica': ['HelveticaNeueRoman', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'course-details-heading-small': ['26px', '36px'],
        'course-details-heading-large': ['36px', '44px'],
        'home-heading-small': ['28px', '34px'],
        'home-heading-large': ['48px', '56px'],
        'default': ['15px', '21px']
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px,1fr))',
      },
      spacing: {
        'section-height': '500px'
      },
      maxWidth: {
        "course-card": "424px",
      },
      boxShadow: {
        "custom-card": "0px 4px 15px 2px rgba(0,0,0,0.1)",
        "glow": "0 0 40px rgba(233, 30, 99, 0.3)",
        "glow-sm": "0 0 20px rgba(233, 30, 99, 0.2)",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
        'gradient-accent': 'linear-gradient(135deg, #D4AF37 0%, #B8941A 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, rgba(233,30,99,0.15) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

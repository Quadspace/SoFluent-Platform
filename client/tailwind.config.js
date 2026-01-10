/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // So Fluent Brand Colors
        'sf-coral': '#FF6B6B',
        'sf-coral-light': '#FF8E8E',
        'sf-coral-dark': '#E85555',
        'sf-black': '#0A0A0B',
        'sf-dark': '#111113',
        'sf-darker': '#0D0D0E',
        'sf-card': '#1A1A1D',
        'sf-purple': '#8B5CF6',
        'sf-blue': '#3B82F6',
        'sf-green': '#22C55E',
        'sf-gold': '#F59E0B',
        // Legacy colors for compatibility
        'sofluent-pink': '#FF6B6B',
        'sofluent-dark': '#0A0A0B',
        'sofluent-accent': '#8B5CF6',
      },
      fontFamily: {
        'display': ['Sora', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
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
        "glow": "0 0 40px rgba(255, 107, 107, 0.3)",
        "glow-sm": "0 0 20px rgba(255, 107, 107, 0.2)",
      },
      backgroundImage: {
        'gradient-coral': 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0B 0%, #111113 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, rgba(255,107,107,0.15) 0%, transparent 70%)',
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

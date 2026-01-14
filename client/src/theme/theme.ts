/**
 * So Fluent Theme System
 * Single source of truth for all colors, fonts, and spacing
 * 
 * ARCHITECTURAL RULE #1: ONE theme.ts to Rule Them All
 * All colors, fonts, and spacing MUST come from this file
 * Applied via Tailwind CSS classes - NO hardcoded values or inline styles
 */

export const theme = {
  // ============================================
  // COLORS - All brand and semantic colors
  // ============================================
  colors: {
    // Primary Brand Colors
    primary: '#E91E63',        // So Fluent Cherry
    primaryDark: '#C2185B',
    primaryLight: '#F48FB1',
    
    // Accent Colors
    accent: '#D4AF37',         // Old Gold
    accentDark: '#B8941A',
    accentLight: '#E5C866',
    
    // Neutral Colors
    black: '#1A1A1A',
    dark: '#0A0A0A',
    white: '#FFFFFF',
    gray: '#666666',
    
    // Semantic Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Text Colors
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      tertiary: '#999999',
      light: '#FFFFFF',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    
    // Background Colors
    background: {
      default: '#FFFFFF',
      dark: '#0A0A0A',
      darkSecondary: '#1A1A1A',
      darkTertiary: '#2A2A2A',
      light: '#F8F9FA',
      gray: '#F5F5F5',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    
    // Border Colors
    border: {
      light: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.1)',
      accent: 'rgba(233, 30, 99, 0.2)',
    },
  },

  // ============================================
  // TYPOGRAPHY - All font families, sizes, weights
  // ============================================
  typography: {
    // Font Families
    fontFamily: {
      display: ['Actay-Regular', 'HelveticaNeueRoman', 'sans-serif'],
      body: ['HelveticaNeueRoman', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      bold: ['HelveticaNeueBold', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    },
    
    // Font Sizes (in rem)
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
      '8xl': '6rem',      // 96px
    },
    
    // Line Heights
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    // Font Weights
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Letter Spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ============================================
  // SPACING - 8px base unit system
  // ============================================
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 40px rgba(233, 30, 99, 0.3)',
    glowSm: '0 0 20px rgba(233, 30, 99, 0.2)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // ============================================
  // GRADIENTS
  // ============================================
  gradients: {
    primary: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
    accent: 'linear-gradient(135deg, #D4AF37 0%, #B8941A 100%)',
    hero: 'linear-gradient(135deg, #E91E63 0%, #D4AF37 50%, #E91E63 100%)',
    dark: 'linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 100%)',
    radial: 'radial-gradient(ellipse at center, rgba(233,30,99,0.15) 0%, transparent 70%)',
  },

  // ============================================
  // TRANSITIONS
  // ============================================
  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  // ============================================
  // Z-INDEX SCALE
  // ============================================
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    skipLink: 10000,
  },

  // ============================================
  // BREAKPOINTS (mobile-first)
  // ============================================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Export type for TypeScript (if using TS)
export type Theme = typeof theme;

// Export default
export default theme;

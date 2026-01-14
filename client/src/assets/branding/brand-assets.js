/**
 * So Fluent Brand Assets
 * 
 * Brand Kit Source: https://drive.google.com/drive/folders/108UeI-Mr564Q05WOUT8SMKyFvARBj69q
 * 
 * Brand Kit Applied: January 2026
 */

// Logo imports - Using actual brand kit logos
import logoCherry from './logos/PNG/Cherry@2x.png';
import logoBlack from './logos/PNG/Black@2x.png';
import logoWhite from './logos/PNG/White@2x.png';
import logoGris from './logos/PNG/Gris@3x.png';
import logoOldGold from './logos/PNG/Old Gold@2x.png';
import logoIconCherry from './logos/PNG/Cherry@3x.png';
import logoIconWhite from './logos/PNG/White@3x.png';
import logoIconBlack from './logos/PNG/Black@3x.png';

export const brandAssets = {
  logos: {
    // Main logos
    cherry: logoCherry,      // Primary brand color logo
    black: logoBlack,         // Dark theme
    white: logoWhite,         // Light theme
    gris: logoGris,           // Gray variant
    oldGold: logoOldGold,     // Gold variant
    
    // Icon versions
    iconCherry: logoIconCherry,
    iconWhite: logoIconWhite,
    iconBlack: logoIconBlack,
    
    // Defaults
    light: logoWhite,         // For dark backgrounds
    dark: logoBlack,          // For light backgrounds
    primary: logoCherry,      // Primary brand logo
  },
  fonts: {
    // Actay font family
    actay: {
      regular: 'Actay-Regular',
      italic: 'Actay-RegularItalic',
    },
    // Helvetica Neue font family
    helvetica: {
      roman: 'HelveticaNeueRoman',
      bold: 'HelveticaNeueBold',
      mediumItalic: 'HelveticaNeueMediumItalic',
    },
  },
  patterns: {
    // Patterns will be added after reviewing brand manual
  }
};

/**
 * Brand Colors (from brand manual)
 * 
 * Based on logo color variants:
 * - Cherry: Primary brand color (likely #E91E63 or similar pink/red)
 * - Black: #000000 or #1A1A1A
 * - White: #FFFFFF
 * - Gris: Gray tones
 * - Old Gold: Gold accent color
 * 
 * Note: Exact hex codes should be extracted from brand manual PDF
 */
export const brandColors = {
  // Primary colors from logo variants
  cherry: '#E91E63',        // Primary brand color (Cherry logo)
  black: '#1A1A1A',         // Dark color
  white: '#FFFFFF',         // White
  gris: '#666666',          // Gray
  oldGold: '#D4AF37',       // Gold accent
  
  // Legacy names for compatibility
  primary: '#E91E63',
  secondary: '#1A1A1A',
  accent: '#D4AF37',
};

/**
 * Brand Typography
 * 
 * Primary: Actay (Regular, RegularItalic)
 * Secondary: Helvetica Neue (Roman, Bold, MediumItalic)
 */
export const brandTypography = {
  primary: 'Actay, sans-serif',
  secondary: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  weights: {
    regular: 400,
    medium: 500,
    bold: 700,
  }
};

/**
 * Global Theme Context
 * Allows changing styles globally across all pages
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { designTokens } from '../design-system/designTokens';

const ThemeContext = createContext();

// Theme presets
export const themes = {
  default: {
    name: 'So Fluent Default',
    colors: {
      primary: designTokens.colors.cherry,
      primaryDark: designTokens.colors.cherryDark,
      primaryLight: designTokens.colors.cherryLight,
      accent: designTokens.colors.oldGold,
      accentDark: designTokens.colors.oldGoldDark,
      accentLight: designTokens.colors.oldGoldLight,
      background: designTokens.colors.white,
      backgroundDark: designTokens.colors.dark,
      backgroundSecondary: designTokens.colors.black,
      text: designTokens.colors.black,
      textSecondary: designTokens.colors.gris,
      textLight: designTokens.colors.white,
    },
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: designTokens.colors.cherry,
      primaryDark: designTokens.colors.cherryDark,
      primaryLight: designTokens.colors.cherryLight,
      accent: designTokens.colors.oldGold,
      accentDark: designTokens.colors.oldGoldDark,
      accentLight: designTokens.colors.oldGoldLight,
      background: designTokens.colors.dark,
      backgroundDark: designTokens.colors.black,
      backgroundSecondary: designTokens.colors.black,
      text: designTokens.colors.white,
      textSecondary: designTokens.colors.gris,
      textLight: designTokens.colors.white,
    },
  },
  light: {
    name: 'Light Mode',
    colors: {
      primary: designTokens.colors.cherry,
      primaryDark: designTokens.colors.cherryDark,
      primaryLight: designTokens.colors.cherryLight,
      accent: designTokens.colors.oldGold,
      accentDark: designTokens.colors.oldGoldDark,
      accentLight: designTokens.colors.oldGoldLight,
      background: designTokens.colors.white,
      backgroundDark: '#F5F5F5',
      backgroundSecondary: '#FAFAFA',
      text: designTokens.colors.black,
      textSecondary: designTokens.colors.gris,
      textLight: designTokens.colors.white,
    },
  },
  custom: {
    name: 'Custom Theme',
    colors: {
      primary: designTokens.colors.cherry,
      primaryDark: designTokens.colors.cherryDark,
      primaryLight: designTokens.colors.cherryLight,
      accent: designTokens.colors.oldGold,
      accentDark: designTokens.colors.oldGoldDark,
      accentLight: designTokens.colors.oldGoldLight,
      background: designTokens.colors.white,
      backgroundDark: designTokens.colors.dark,
      backgroundSecondary: designTokens.colors.black,
      text: designTokens.colors.black,
      textSecondary: designTokens.colors.gris,
      textLight: designTokens.colors.white,
    },
  },
};

export const ThemeProvider = ({ children, initialTheme = 'default' }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [customColors, setCustomColors] = useState(null);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('sofluent-theme');
    const savedCustomColors = localStorage.getItem('sofluent-custom-colors');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedCustomColors) {
      try {
        setCustomColors(JSON.parse(savedCustomColors));
      } catch (e) {
        console.error('Failed to parse custom colors:', e);
      }
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = customColors ? { ...themes.custom, colors: customColors } : themes[currentTheme];
    
    const root = document.documentElement;
    
    // Set CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Save to localStorage
    localStorage.setItem('sofluent-theme', currentTheme);
    if (customColors) {
      localStorage.setItem('sofluent-custom-colors', JSON.stringify(customColors));
    }
  }, [currentTheme, customColors]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      setCustomColors(null);
    }
  };

  const updateCustomColors = (colors) => {
    setCustomColors(colors);
    setCurrentTheme('custom');
  };

  const resetTheme = () => {
    setCurrentTheme('default');
    setCustomColors(null);
    localStorage.removeItem('sofluent-theme');
    localStorage.removeItem('sofluent-custom-colors');
  };

  const getTheme = () => {
    if (customColors) {
      return { ...themes.custom, colors: customColors };
    }
    return themes[currentTheme];
  };

  const value = {
    currentTheme,
    theme: getTheme(),
    themes,
    changeTheme,
    updateCustomColors,
    resetTheme,
    customColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;

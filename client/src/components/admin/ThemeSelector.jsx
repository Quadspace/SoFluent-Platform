/**
 * Theme Selector Component
 * Allows admin/user to change global theme
 */

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Moon, Sun, Settings, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandButton from '../common/BrandButton';
import BrandCard from '../common/BrandCard';
import BrandText from '../common/BrandText';

const ThemeSelector = ({ isAdmin = false, showForAll = true }) => {
  const { currentTheme, theme, themes, changeTheme, updateCustomColors, resetTheme } = useTheme();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: theme.colors.primary,
    primaryDark: theme.colors.primaryDark,
    accent: theme.colors.accent,
    background: theme.colors.background,
    backgroundDark: theme.colors.backgroundDark,
    text: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
  });

  const handleColorChange = (key, value) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    updateCustomColors(newColors);
  };

  // Hide if showForAll is false and user is not admin
  if (!showForAll && !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-sofluent-cherry to-sofluent-cherry-dark text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          aria-label="Theme Selector"
        >
          <Palette className="w-6 h-6" />
        </button>

        {/* Theme Panel */}
        <AnimatePresence>
          {showCustomizer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 right-0 w-80 bg-white dark:bg-sofluent-dark rounded-xl shadow-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <BrandText size="lg" color="primary" weight="bold">
                  Theme Settings
                </BrandText>
                <button
                  onClick={() => setShowCustomizer(false)}
                  className="text-sofluent-gris hover:text-sofluent-cherry"
                >
                  ×
                </button>
              </div>

              {/* Preset Themes */}
              <div className="mb-6">
                <BrandText size="sm" color="secondary" className="mb-3">
                  Preset Themes
                </BrandText>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themes).map(([key, themeOption]) => (
                    <button
                      key={key}
                      onClick={() => changeTheme(key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        currentTheme === key
                          ? 'border-sofluent-cherry bg-sofluent-cherry/10'
                          : 'border-gray-200 hover:border-sofluent-cherry/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {key === 'dark' && <Moon className="w-4 h-4" />}
                        {key === 'light' && <Sun className="w-4 h-4" />}
                        {key === 'custom' && <Settings className="w-4 h-4" />}
                        <BrandText size="sm" color="primary">
                          {themeOption.name}
                        </BrandText>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Picker (Admin Only) */}
              {isAdmin && (
                <div className="mb-4">
                  <BrandText size="sm" color="secondary" className="mb-3">
                    Custom Colors
                  </BrandText>
                  <div className="space-y-2">
                    {Object.entries(customColors).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <label className="text-xs text-sofluent-gris w-24 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </label>
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-16 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <BrandButton
                variant="ghost"
                size="small"
                fullWidth
                onClick={resetTheme}
                className="flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </BrandButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ThemeSelector;

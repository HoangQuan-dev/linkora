'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Palette, Lock, Crown } from 'lucide-react';
import { Theme, THEME_PRESETS } from '@/types';
import { cn } from '@/utils';

interface ThemePickerProps {
  currentTheme: Theme;
  onThemeChange: (theme: Partial<Theme>) => void;
  onPresetSelect: (presetName: string) => void;
  canUsePremiumThemes?: boolean;
}

export function ThemePicker({ 
  currentTheme, 
  onThemeChange, 
  onPresetSelect,
  canUsePremiumThemes = false 
}: ThemePickerProps) {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const handlePresetSelect = (presetName: string) => {
    const preset = THEME_PRESETS.find(p => p.name === presetName);
    if (preset) {
      if (preset.category === 'premium' && !canUsePremiumThemes) {
        // Show upgrade prompt or handle premium restriction
        return;
      }
      onPresetSelect(presetName);
    }
  };

  const getPremiumIndicator = () => (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Lock className="w-3 h-3" />
      Premium
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Presets</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isPremium = preset.category === 'premium';
            const isDisabled = isPremium && !canUsePremiumThemes;
            
            return (
              <motion.button
                key={preset.name}
                onClick={() => handlePresetSelect(preset.name)}
                disabled={isDisabled}
                className={cn(
                  'relative p-4 rounded-lg border-2 transition-all',
                  currentTheme.primaryColor === preset.theme.primaryColor &&
                  currentTheme.backgroundColor === preset.theme.backgroundColor
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
              >
                {/* Theme Preview */}
                <div 
                  className="w-full h-16 rounded mb-2"
                  style={{ 
                    background: preset.theme.backgroundGradient 
                      ? `linear-gradient(${preset.theme.backgroundGradient.direction}, ${preset.theme.backgroundGradient.from}, ${preset.theme.backgroundGradient.to})`
                      : preset.theme.backgroundColor 
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: preset.theme.primaryColor }}
                    />
                  </div>
                </div>
                
                {/* Theme Name */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{preset.name}</span>
                  {isPremium && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                
                {/* Premium Indicator */}
                {isPremium && (
                  <div className="mt-1">
                    {getPremiumIndicator()}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Colors</h3>
        <div className="space-y-4">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
                onClick={() => setActiveColorPicker(activeColorPicker === 'primary' ? null : 'primary')}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={currentTheme.primaryColor}
                  onChange={(e) => onThemeChange({ primaryColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
            {activeColorPicker === 'primary' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <HexColorPicker
                  color={currentTheme.primaryColor}
                  onChange={(color: string) => onThemeChange({ primaryColor: color })}
                />
              </motion.div>
            )}
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                style={{ backgroundColor: currentTheme.backgroundColor }}
                onClick={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={currentTheme.backgroundColor}
                  onChange={(e) => onThemeChange({ backgroundColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
            {activeColorPicker === 'background' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <HexColorPicker
                  color={currentTheme.backgroundColor}
                  onChange={(color: string) => onThemeChange({ backgroundColor: color })}
                />
              </motion.div>
            )}
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Text Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                style={{ backgroundColor: currentTheme.textColor }}
                onClick={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={currentTheme.textColor}
                  onChange={(e) => onThemeChange({ textColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
            {activeColorPicker === 'text' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <HexColorPicker
                  color={currentTheme.textColor}
                  onChange={(color: string) => onThemeChange({ textColor: color })}
                />
              </motion.div>
            )}
          </div>

          {/* Card Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Card Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                style={{ backgroundColor: currentTheme.cardColor }}
                onClick={() => setActiveColorPicker(activeColorPicker === 'card' ? null : 'card')}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={currentTheme.cardColor}
                  onChange={(e) => onThemeChange({ cardColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
            {activeColorPicker === 'card' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <HexColorPicker
                  color={currentTheme.cardColor}
                  onChange={(color: string) => onThemeChange({ cardColor: color })}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={currentTheme.isDarkMode}
            onChange={(e) => onThemeChange({ isDarkMode: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="font-medium">Dark Mode</span>
        </label>
      </div>

      {/* Current Theme Values */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Theme Values</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          {Object.entries(currentTheme).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="font-mono text-gray-600 dark:text-gray-400">{key}:</span>
              <code className="font-mono text-gray-800 dark:text-gray-200">
                {String(value)}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
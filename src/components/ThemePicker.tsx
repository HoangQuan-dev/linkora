'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import { Theme, THEME_PRESETS } from '@/types';
import { cn } from '@/utils';

interface ThemePickerProps {
  currentTheme: Theme;
  onThemeChange: (theme: Partial<Theme>) => void;
  onPresetSelect: (presetName: string) => void;
}

export function ThemePicker({ 
  currentTheme, 
  onThemeChange, 
  onPresetSelect 
}: ThemePickerProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState<string | null>(null);

  const handlePresetSelect = (presetName: string) => {
    onPresetSelect(presetName);
    setIsCustomMode(false);
    setColorPickerTarget(null);
  };

  const handleColorChange = (color: string, property: keyof Theme) => {
    onThemeChange({ [property]: color });
  };

  const colorProperties = [
    { key: 'primaryColor' as keyof Theme, label: 'Primary Color', description: 'Main accent color' },
    { key: 'backgroundColor' as keyof Theme, label: 'Background', description: 'Page background' },
    { key: 'cardColor' as keyof Theme, label: 'Card Color', description: 'Link card background' },
    { key: 'textColor' as keyof Theme, label: 'Text Color', description: 'Main text color' },
  ];

  const toggleDarkMode = () => {
    onThemeChange({ isDarkMode: !currentTheme.isDarkMode });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Theme</h3>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`Switch to ${currentTheme.isDarkMode ? 'light' : 'dark'} mode`}
        >
          {currentTheme.isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setIsCustomMode(false)}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            !isCustomMode 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
          )}
        >
          Presets
        </button>
        <button
          onClick={() => setIsCustomMode(true)}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            isCustomMode 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
          )}
        >
          Custom
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isCustomMode ? (
          /* Preset Themes */
          <motion.div
            key="presets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 gap-3"
          >
            {THEME_PRESETS.map((preset) => {
              const isSelected = JSON.stringify(currentTheme) === JSON.stringify(preset.theme);
              
              return (
                <motion.button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset.name)}
                  className={cn(
                    'relative p-3 rounded-xl border-2 transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    isSelected 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Theme Preview */}
                  <div 
                    className="w-full h-20 rounded-lg mb-2 relative overflow-hidden"
                    style={{
                      background: preset.theme.backgroundGradient 
                        ? `linear-gradient(${preset.theme.backgroundGradient.direction}, ${preset.theme.backgroundGradient.from}, ${preset.theme.backgroundGradient.to})`
                        : preset.theme.backgroundColor
                    }}
                  >
                    {/* Mini avatar */}
                    <div 
                      className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.theme.primaryColor }}
                    />
                    
                    {/* Mini link cards */}
                    <div className="absolute bottom-2 left-2 right-2 space-y-1">
                      <div 
                        className="h-2 rounded"
                        style={{ backgroundColor: preset.theme.cardColor }}
                      />
                      <div 
                        className="h-2 rounded w-3/4"
                        style={{ backgroundColor: preset.theme.cardColor }}
                      />
                    </div>

                    {/* Background decoration */}
                    <div 
                      className="absolute top-0 right-0 w-8 h-8 rounded-full blur-xl opacity-30"
                      style={{ backgroundColor: preset.theme.primaryColor }}
                    />
                  </div>

                  {/* Theme Name */}
                  <div className="text-sm font-medium text-center">
                    {preset.name}
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          /* Custom Colors */
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {colorProperties.map((property) => (
              <div key={property.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">
                      {property.label}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {property.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setColorPickerTarget(
                      colorPickerTarget === property.key ? null : property.key
                    )}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: currentTheme[property.key] as string }}
                  />
                </div>

                <AnimatePresence>
                  {colorPickerTarget === property.key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <HexColorPicker
                          color={currentTheme[property.key] as string}
                          onChange={(color) => handleColorChange(color, property.key)}
                        />
                        <div className="mt-3 text-center">
                          <code className="text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded">
                            {String(currentTheme[property.key])}
                          </code>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Reset to preset */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Reset to preset:
              </p>
              <div className="flex gap-2 flex-wrap">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset.name)}
                    className="px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
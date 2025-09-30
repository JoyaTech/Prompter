// FIX: Implemented the ThemeCustomizer component.
import React from 'react';
import { useTheme } from './ThemeContext';
import { useTranslation } from 'react-i18next';
import { ThemeDensity, ThemeFonts, ThemePreset } from '../types';

const ThemeCustomizer: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setThemePreset, updateThemeColors, updateThemeSetting, availablePresets } = useTheme();
  
  const fontOptions: (keyof ThemeFonts)[] = ['heading', 'body'];
  const densityOptions: ThemeDensity[] = ['compact', 'comfortable', 'spacious'];

  return (
    <div className="bg-card p-6 rounded-lg border border-border-color max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Presets */}
        <div>
          <h3 className="text-lg font-semibold text-text-main mb-3">Presets</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(availablePresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setThemePreset(key as ThemePreset)}
                className={`p-3 rounded-md border-2 transition-colors ${
                  theme.name === preset.name ? 'border-primary' : 'border-border-color hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-text-main mb-2">{preset.name}</div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.primary }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.accent }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors['card-secondary'] }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.background }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Colors */}
        <div>
          <h3 className="text-lg font-semibold text-text-main mb-3">Colors</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {Object.entries(theme.colors).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between">
                <label htmlFor={`color-${name}`} className="text-sm text-text-secondary capitalize">
                  {name.replace('-', ' ')}
                </label>
                <input
                  id={`color-${name}`}
                  type="color"
                  value={value}
                  onChange={(e) => updateThemeColors({ [name]: e.target.value })}
                  className="w-10 h-8 p-0 border-none rounded bg-card-secondary cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Fonts */}
        <div>
          <h3 className="text-lg font-semibold text-text-main mb-3">Typography</h3>
          <div className="space-y-3">
            {fontOptions.map(fontType => (
              <div key={fontType}>
                <label className="block text-sm font-medium text-text-secondary mb-1 capitalize">{fontType} Font</label>
                <input
                  type="text"
                  value={theme.fonts[fontType]}
                  onChange={(e) => updateThemeSetting('fonts', { ...theme.fonts, [fontType]: e.target.value })}
                  className="w-full px-3 py-1.5 bg-background border border-border-color rounded-md text-sm"
                  placeholder="e.g., Inter"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Density & Radius */}
        <div>
          <h3 className="text-lg font-semibold text-text-main mb-3">Layout</h3>
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Density</label>
                <div className="flex gap-2">
                    {densityOptions.map(d => (
                        <button key={d} onClick={() => updateThemeSetting('density', d)} className={`px-3 py-1 text-sm rounded-md capitalize ${theme.density === d ? 'bg-primary text-white' : 'bg-card-secondary hover:bg-border-color'}`}>
                            {d}
                        </button>
                    ))}
                </div>
             </div>
             <div>
                <label htmlFor="border-radius" className="block text-sm font-medium text-text-secondary mb-1">Border Radius: {theme.borderRadius}rem</label>
                <input
                  id="border-radius"
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.125"
                  value={theme.borderRadius}
                  onChange={(e) => updateThemeSetting('borderRadius', parseFloat(e.target.value))}
                  className="w-full"
                />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThemeCustomizer;

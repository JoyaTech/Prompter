import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { ThemeSettings, ThemePreset, ThemeColors } from '../types';

const PRESETS: Record<ThemePreset, ThemeSettings> = {
  default: {
    name: 'Default',
    colors: { primary: '#8B5CF6', background: '#111827', card: '#1F2937', 'card-secondary': '#374151', 'text-main': '#F9FAFB', 'text-secondary': '#9CA3AF', 'border-color': '#4B5563', accent: '#10B981' },
    fonts: { heading: 'Inter', body: 'Inter' },
    density: 'comfortable',
    borderRadius: 0.5,
  },
  ocean: {
    name: 'Ocean',
    colors: { primary: '#3B82F6', background: '#0B1D34', card: '#122C4A', 'card-secondary': '#1A3A5F', 'text-main': '#EFF6FF', 'text-secondary': '#A3BFDB', 'border-color': '#254D7D', accent: '#2DD4BF' },
    fonts: { heading: 'Roboto', body: 'Lato' },
    density: 'comfortable',
    borderRadius: 0.75,
  },
  forest: {
    name: 'Forest',
    colors: { primary: '#22C55E', background: '#101D15', card: '#1A2B20', 'card-secondary': '#223C2B', 'text-main': '#E2F0E8', 'text-secondary': '#9ABBAD', 'border-color': '#2F523C', accent: '#F59E0B' },
    fonts: { heading: 'Merriweather', body: 'Source Sans Pro' },
    density: 'comfortable',
    borderRadius: 0.375,
  },
  sunset: {
    name: 'Sunset',
    colors: { primary: '#F97316', background: '#2B1611', card: '#40211A', 'card-secondary': '#5A2E24', 'text-main': '#FFEFE5', 'text-secondary': '#F4C0AF', 'border-color': '#753C2F', accent: '#EC4899' },
    fonts: { heading: 'Playfair Display', body: 'Montserrat' },
    density: 'comfortable',
    borderRadius: 1,
  },
};

const DENSITY_MAP = {
  compact: { '--ui-padding-x': '0.75rem', '--ui-padding-y': '0.375rem', '--ui-gap': '0.5rem' },
  comfortable: { '--ui-padding-x': '1rem', '--ui-padding-y': '0.5rem', '--ui-gap': '0.75rem' },
  spacious: { '--ui-padding-x': '1.25rem', '--ui-padding-y': '0.75rem', '--ui-gap': '1rem' },
};


interface ThemeContextType {
  theme: ThemeSettings;
  setThemePreset: (preset: ThemePreset) => void;
  updateThemeColors: (newColors: Partial<ThemeColors>) => void;
  updateThemeSetting: (key: keyof Omit<ThemeSettings, 'name' | 'colors'>, value: any) => void;
  availablePresets: Record<ThemePreset, ThemeSettings>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    try {
        const savedTheme = localStorage.getItem('flow-it-magical-theme');
        return savedTheme ? JSON.parse(savedTheme) : PRESETS.default;
    } catch {
        return PRESETS.default;
    }
  });

  const applyTheme = useCallback((currentTheme: ThemeSettings) => {
    localStorage.setItem('flow-it-magical-theme', JSON.stringify(currentTheme));
    const root = document.documentElement;
    
    // Apply colors
    for (const [key, value] of Object.entries(currentTheme.colors)) {
      root.style.setProperty(`--color-${key}`, value);
    }
    // Apply fonts
    root.style.setProperty('--font-heading', currentTheme.fonts.heading);
    root.style.setProperty('--font-body', currentTheme.fonts.body);
    
    // Apply density
    const densityStyles = DENSITY_MAP[currentTheme.density];
    for (const [key, value] of Object.entries(densityStyles)) {
        root.style.setProperty(key, value);
    }
    
    // Apply border radius
    root.style.setProperty('--ui-border-radius', `${currentTheme.borderRadius}rem`);

    // Manage Google Fonts stylesheet
    const fontLink = document.getElementById('google-fonts');
    const headingFont = currentTheme.fonts.heading.replace(' ', '+');
    const bodyFont = currentTheme.fonts.body.replace(' ', '+');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@700&family=${bodyFont}:wght@400;600&display=swap`;
    
    if (fontLink) {
        (fontLink as HTMLLinkElement).href = fontUrl;
    } else {
        const newLink = document.createElement('link');
        newLink.id = 'google-fonts';
        newLink.rel = 'stylesheet';
        newLink.href = fontUrl;
        document.head.appendChild(newLink);
    }

  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setThemePreset = (preset: ThemePreset) => {
    setTheme(PRESETS[preset]);
  };

  const updateThemeColors = (newColors: Partial<ThemeColors>) => {
    setTheme(prev => ({
        ...prev,
        name: 'Custom',
        colors: { ...prev.colors, ...newColors },
    }));
  };
  
  const updateThemeSetting = (key: keyof Omit<ThemeSettings, 'name' | 'colors'>, value: any) => {
      setTheme(prev => ({
        ...prev,
        name: 'Custom',
        [key]: value,
      }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemePreset, updateThemeColors, updateThemeSetting, availablePresets: PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
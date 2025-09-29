import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme: Theme = {
  primary: '#4f46e5', // indigo-600
  background: '#111827', // gray-900
  card: '#1f2937', // gray-800
  cardSecondary: '#374151', // gray-700
  textMain: '#f9fafb', // gray-50
  textSecondary: '#9ca3af', // gray-400
  accent: '#22d3ee', // cyan-400
  border: '#374151', // gray-700
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('app-theme');
      return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    } catch (error) {
      console.error("Failed to load theme from localStorage", error);
      return defaultTheme;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app-theme', JSON.stringify(theme));
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-background', theme.background);
      root.style.setProperty('--color-card', theme.card);
      root.style.setProperty('--color-card-secondary', theme.cardSecondary);
      root.style.setProperty('--color-text-main', theme.textMain);
      root.style.setProperty('--color-text-secondary', theme.textSecondary);
      root.style.setProperty('--color-accent', theme.accent);
      root.style.setProperty('--color-border', theme.border);
    } catch (error) {
      console.error("Failed to save theme or apply styles", error);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
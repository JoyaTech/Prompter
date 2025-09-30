import React, { useState } from 'react';
import { GithubIcon } from './icons';
import { getSupportedLanguages, getCurrentLanguage } from '../../locales/i18n';

interface HeaderProps {
  t: (key: string) => string;
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
  focusModeActive?: boolean;
  onFocusModeToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  t, 
  currentLanguage = 'en',
  onLanguageChange,
  focusModeActive = false,
  onFocusModeToggle
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const supportedLanguages = getSupportedLanguages();

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange?.(langCode);
    setShowLanguageMenu(false);
  };

  return (
    <header className="flex-shrink-0 bg-card/50 backdrop-blur-sm border-b border-border px-8 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-text-main">{t('app_subtitle')}</h1>
        
        {/* Status indicators */}
        <div className="flex items-center space-x-2">
          {focusModeActive && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{t('adhd_focus_mode_active')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Focus Mode Toggle */}
        {onFocusModeToggle && (
          <button
            onClick={onFocusModeToggle}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${focusModeActive 
                ? 'bg-green-500 text-white shadow-lg hover:bg-green-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={focusModeActive ? t('adhd_exit_focus_mode') : t('adhd_enter_focus_mode')}
          >
            <span className="flex items-center space-x-2">
              <span>{focusModeActive ? '🎯' : '👁️'}</span>
              <span className="hidden sm:inline">
                {focusModeActive ? t('adhd_focus_active') : t('adhd_focus')}
              </span>
            </span>
          </button>
        )}

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-text-main bg-card hover:bg-card-secondary rounded-lg transition-all duration-200"
            title={t('switch_language')}
          >
            <span className="text-sm">
              {currentLanguage === 'he' ? '🇮🇱 עב' : '🇺🇸 EN'}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Language Menu */}
          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-20">
              {supportedLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-card-secondary transition-colors
                    ${currentLanguage === lang.code 
                      ? 'text-primary font-medium bg-accent' 
                      : 'text-text-main'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{lang.nativeName}</span>
                    <span className="text-xs text-text-secondary">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sync Status */}
        <div className="hidden md:flex items-center space-x-1 text-xs text-text-secondary">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{t('integrations.sync_status')}: {t('connected')}</span>
        </div>

        {/* GitHub Link */}
        <a 
          href="https://github.com/JoyaTech/Alchemist" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-main transition-colors p-2 hover:bg-card rounded-lg"
          aria-label="GitHub Repository"
          title="View on GitHub"
        >
          <GithubIcon className="w-5 h-5" />
        </a>

        {/* User Menu (placeholder for future authentication) */}
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-shadow duration-200">
          🧪
        </div>
      </div>

      {/* Click outside to close language menu */}
      {showLanguageMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
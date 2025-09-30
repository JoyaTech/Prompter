

import React from 'react';
import { useTranslation } from 'react-i18next';
import { GithubIcon } from './icons';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="flex-shrink-0 bg-card/50 border-b border-border-color px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-text-main">{t('app_subtitle')}</h1>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => changeLanguage('en')}
            className={`font-semibold transition-colors ${
              i18n.language.startsWith('en') ? 'text-primary' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            EN
          </button>
          <span className="text-border-color">|</span>
          <button
            onClick={() => changeLanguage('he')}
            className={`font-semibold transition-colors ${
              i18n.language === 'he' ? 'text-primary' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            HE
          </button>
        </div>
        <a 
          href="https://github.com/google/generative-ai-docs/tree/main/site/en/tutorials/prompt_gallery" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-main transition-colors"
          aria-label="GitHub Repository"
        >
          <GithubIcon className="w-6 h-6" />
        </a>
      </div>
    </header>
  );
};

export default Header;
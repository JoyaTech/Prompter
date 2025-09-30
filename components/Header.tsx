
import React from 'react';
import { GithubIcon } from './icons';

interface HeaderProps {
  t: (key: string) => string;
}

const Header: React.FC<HeaderProps> = ({ t }) => {
  return (
    <header className="flex-shrink-0 bg-card/50 border-b border-border-color px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-text-main">{t('app_subtitle')}</h1>
      <div>
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

import React from 'react';
import { GithubIcon } from './icons';

interface HeaderProps {
  t: (key: string) => string;
}

const Header: React.FC<HeaderProps> = ({ t }) => {
  return (
    <header className="flex-shrink-0 bg-gray-800/50 border-b border-gray-700 px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-200">{t('app_subtitle')}</h1>
      <div>
        <a 
          href="https://github.com/google/generative-ai-docs/tree/main/site/en/tutorials/prompt_gallery" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="GitHub Repository"
        >
          <GithubIcon className="w-6 h-6" />
        </a>
      </div>
    </header>
  );
};

export default Header;

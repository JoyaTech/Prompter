import React from 'react';
// FIX: Corrected import paths to be relative.
import { FlowItLogo } from './icons'; 
import { Language } from '../types';

interface HeaderProps {
    currentLang: Language;
    setLang: (lang: Language) => void;
    t: (key: any) => string;
}

function Header({ currentLang, setLang, t }: HeaderProps): React.ReactElement {
  const isHebrew = currentLang === 'he';

  return (
    <header className="relative text-center mb-10">
      <div className="absolute top-0 left-0">
         <button
            onClick={() => setLang(isHebrew ? 'en' : 'he')}
            className="px-4 py-2 text-sm font-medium rounded-full transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300"
            title={t('switch_title')}
        >
            {t('switch_lang')}
        </button>
      </div>
      <div className="flex justify-center items-center gap-4 mb-2">
        <FlowItLogo className="w-12 h-12" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-500 bg-clip-text text-transparent">
          {t('app_title')}
        </h1>
      </div>
      <p className="text-lg text-gray-400">
        {t('app_tagline')}
      </p>
    </header>
  );
}

export default Header;

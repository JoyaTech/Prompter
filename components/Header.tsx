import React from 'react';
import { LogoIcon } from './icons';

// FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
function Header(): React.ReactElement {
  return (
    <header className="text-center mb-10">
      <div className="flex justify-center items-center gap-4 mb-2">
        <LogoIcon className="w-12 h-12" />
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Prompt Perfect
        </h1>
      </div>
      <p className="text-lg text-gray-400">
        Transform your ideas into powerful, precise prompts.
      </p>
    </header>
  );
}

export default Header;

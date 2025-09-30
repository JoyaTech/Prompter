import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PromptEditor from './components/PromptEditor';
import ThemeCustomizer from './components/ThemeCustomizer';
import AlchemistPage from './components/AlchemistPage';
import { PromptComponent } from './types';

// A simple challenge prompt to demonstrate loading.
const CHALLENGE_PROMPT = "You are a travel agent. A customer wants to book a 7-day trip to a tropical destination for a family of four on a budget of $5000. Provide three distinct options, including flights, accommodation, and two activities for each. Present the options in a markdown table.";

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState('editor');
  const [initialPromptText, setInitialPromptText] = useState<string | null>(null);
  const [initialComponents, setInitialComponents] = useState<PromptComponent[] | null>(null);
  const [promptForAlchemist, setPromptForAlchemist] = useState<string | null>(null);

  useEffect(() => {
    // Demonstrate loading a challenge
    const hasSeenChallenge = localStorage.getItem('seen-challenge');
    if (!hasSeenChallenge) {
      setInitialPromptText(CHALLENGE_PROMPT);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);
  
  const handleInitialPromptLoaded = () => {
    if (initialPromptText === CHALLENGE_PROMPT) {
        localStorage.setItem('seen-challenge', 'true');
    }
    setInitialPromptText(null);
  };
  
  const handleInitialComponentsLoaded = () => {
    setInitialComponents(null);
  };

  const handleNavigateToEditorWithPrompt = (prompt: string) => {
    setView('editor');
    setInitialPromptText(prompt);
    setInitialComponents(null);
  };
  
  const handleNavigateToEditorWithComponents = (components: PromptComponent[]) => {
    setView('editor');
    setInitialComponents(components);
    setInitialPromptText(null);
  };

  const handleNavigateToAlchemistWithPrompt = (prompt: string) => {
    setView('alchemist');
    setPromptForAlchemist(prompt);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard t={t} />;
      case 'editor':
        return <PromptEditor
          initialPromptText={initialPromptText}
          onInitialPromptLoaded={handleInitialPromptLoaded}
          initialComponents={initialComponents}
          onInitialComponentsLoaded={handleInitialComponentsLoaded}
          onSendToAlchemist={handleNavigateToAlchemistWithPrompt}
          t={t}
        />;
      case 'theme':
        return <ThemeCustomizer />;
      case 'alchemist':
        return <AlchemistPage 
          t={t} 
          onRefineInIDE={handleNavigateToEditorWithPrompt}
          onUseRecipe={handleNavigateToEditorWithComponents}
          initialBasePrompt={promptForAlchemist}
          onInitialBasePromptLoaded={() => setPromptForAlchemist(null)}
        />;
      default:
        return <Dashboard t={t} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      <Sidebar currentView={view} onSetView={setView} t={t} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
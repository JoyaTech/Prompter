import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IDEPage from './components/IDEPage';
import AlchemistPage from './components/AlchemistPage';
import AppearancePage from './components/AppearancePage';
import { HistoryItem, PromptComponent, View } from './types';
import { useTranslation } from 'react-i18next';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [promptToEdit, setPromptToEdit] = useState<string | null>(null);
  const [componentsToEdit, setComponentsToEdit] = useState<PromptComponent[] | null>(null);
  const [promptToBlend, setPromptToBlend] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // Set document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleNavigate = (view: View) => {
    setActiveView(view);
  };

  const handleStartChallenge = (prompt: string) => {
    setPromptToEdit(prompt);
    setActiveView('ide');
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setPromptToEdit(item.prompt);
    setActiveView('ide');
  };
  
  const handleRefineInIDE = (prompt: string) => {
      setPromptToEdit(prompt);
      setComponentsToEdit(null); // Clear component view if refining a simple string
      setActiveView('ide');
  };
  
  const handleUseRecipe = (components: PromptComponent[]) => {
      setComponentsToEdit(components);
      setPromptToEdit(null); // Clear simple prompt view
      setActiveView('ide');
  };
  
  const handleRefineInAlchemist = (prompt: string) => {
      setPromptToBlend(prompt);
      setActiveView('alchemist');
  }
  
  const handleInitialPromptLoaded = useCallback(() => {
      setPromptToEdit(null);
      setComponentsToEdit(null);
      setPromptToBlend(null);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onStartChallenge={handleStartChallenge} onSelectHistory={handleSelectHistory} />;
      case 'ide':
        return <IDEPage 
            initialPrompt={promptToEdit}
            initialComponents={componentsToEdit}
            onInitialPromptLoaded={handleInitialPromptLoaded}
            onRefineInAlchemist={handleRefineInAlchemist}
        />;
      case 'alchemist':
        return <AlchemistPage
          onRefineInIDE={handleRefineInIDE}
          onUseRecipe={handleUseRecipe}
          initialBasePrompt={promptToBlend}
          onInitialBasePromptLoaded={handleInitialPromptLoaded}
        />;
      case 'appearance':
        return <AppearancePage />;
      default:
        return <Dashboard onStartChallenge={handleStartChallenge} onSelectHistory={handleSelectHistory} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-main font-body">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <div className="flex-grow flex flex-col">
        <Header />
        <main className="flex-grow p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;

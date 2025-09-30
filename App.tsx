import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
// FIX: Corrected import paths for components by providing their full implementation, resolving the 'is not a module' errors.
import Dashboard from './components/Dashboard';
import PromptEditor from './components/PromptEditor';
import AlchemistPage from './components/AlchemistPage';
import AppearancePage from './components/AppearancePage';
import { EditorState, PromptComponent, HistoryItem } from './types';

// FIX: Added full implementation for the main App component, including routing and state management.
type View = 'dashboard' | 'ide' | 'alchemist' | 'appearance';

function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [initialEditorState, setInitialEditorState] = useState<EditorState | null>(null);
  const [initialAlchemistPrompt, setInitialAlchemistPrompt] = useState<string | null>(null);

  const handleNavigate = useCallback((view: View) => {
    setActiveView(view);
    // Reset initial states when navigating away
    setInitialEditorState(null);
    setInitialAlchemistPrompt(null);
  }, []);
  
  const handleStartChallenge = (prompt: string) => {
    setInitialEditorState({ promptText: prompt });
    setActiveView('ide');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setInitialEditorState({ historyItem: item });
    setActiveView('ide');
  };

  const handleRefineInIDE = (prompt: string) => {
    setInitialEditorState({ promptText: prompt });
    setActiveView('ide');
  };
  
  const handleUseRecipe = (components: PromptComponent[]) => {
    setInitialEditorState({ components });
    setActiveView('ide');
  };

  const handleSendToAlchemist = (prompt: string) => {
    setInitialAlchemistPrompt(prompt);
    setActiveView('alchemist');
  };

  const onInitialStateLoaded = useCallback(() => {
    setInitialEditorState(null);
  }, []);
  
  const onInitialAlchemistPromptLoaded = useCallback(() => {
    setInitialAlchemistPrompt(null);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onStartChallenge={handleStartChallenge} onSelectHistory={handleSelectHistoryItem} />;
      case 'ide':
        return <PromptEditor 
          initialState={initialEditorState} 
          onInitialStateLoaded={onInitialStateLoaded}
          onSendToAlchemist={handleSendToAlchemist}
        />;
      case 'alchemist':
        return <AlchemistPage 
          onRefineInIDE={handleRefineInIDE}
          onUseRecipe={handleUseRecipe}
          initialBasePrompt={initialAlchemistPrompt}
          onInitialBasePromptLoaded={onInitialAlchemistPromptLoaded}
        />;
      case 'appearance':
        return <AppearancePage />;
      default:
        return <Dashboard onStartChallenge={handleStartChallenge} onSelectHistory={handleSelectHistoryItem}/>;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
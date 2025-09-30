import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PromptEditor from './components/PromptEditor';
import ThemeCustomizer from './components/ThemeCustomizer';
import AlchemistPage from './components/AlchemistPage';
import { Prompt, HistoryItem } from './types';
import * as dataService from './services/dataService';

// A simple challenge prompt to demonstrate loading.
const CHALLENGE_PROMPT = "You are a travel agent. A customer wants to book a 7-day trip to a tropical destination for a family of four on a budget of $5000. Provide three distinct options, including flights, accommodation, and two activities for each. Present the options in a markdown table.";

const App: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('editor');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [initialPromptText, setInitialPromptText] = useState<string | null>(null);
  const [promptForAlchemist, setPromptForAlchemist] = useState<string | null>(null);

  useEffect(() => {
    setPrompts(dataService.getPrompts());
    setHistory(dataService.getHistory());
    
    // Demonstrate loading a challenge
    const hasSeenChallenge = localStorage.getItem('seen-challenge');
    if (!hasSeenChallenge) {
      setInitialPromptText(CHALLENGE_PROMPT);
    }
  }, []);
  
  const handleInitialPromptLoaded = () => {
    if (initialPromptText === CHALLENGE_PROMPT) {
        localStorage.setItem('seen-challenge', 'true');
    }
    setInitialPromptText(null);
  };

  const handleSavePrompt = (name: string, text: string) => {
    const newPrompt = { id: uuidv4(), name, text };
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleDeletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleAddHistory = (prompt: string, response: string, alignmentNotes?: string): HistoryItem => {
    const newHistoryItem: HistoryItem = { 
      id: uuidv4(), 
      prompt, 
      response, 
      timestamp: new Date(), 
      alignment_notes: alignmentNotes 
    };
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
    return newHistoryItem;
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
  };

  const handleUpdateHistoryItem = (id: string, updates: Partial<HistoryItem>) => {
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
  };

  const handleNavigateToEditorWithPrompt = (prompt: string) => {
    setView('editor');
    setInitialPromptText(prompt);
  };
  
  const handleNavigateToAlchemistWithPrompt = (prompt: string) => {
    setView('alchemist');
    setPromptForAlchemist(prompt);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard history={history} t={t} />;
      case 'editor':
        return <PromptEditor
          prompts={prompts}
          history={history}
          onSavePrompt={handleSavePrompt}
          onDeletePrompt={handleDeletePrompt}
          onAddHistory={handleAddHistory}
          onDeleteHistory={handleDeleteHistory}
          onUpdateHistoryItem={handleUpdateHistoryItem}
          initialPromptText={initialPromptText}
          onInitialPromptLoaded={handleInitialPromptLoaded}
          onSendToAlchemist={handleNavigateToAlchemistWithPrompt}
          t={t}
        />;
      case 'theme':
        return <ThemeCustomizer />;
      case 'alchemist':
        return <AlchemistPage 
          t={t} 
          onSavePrompt={handleSavePrompt} 
          onRefineInIDE={handleNavigateToEditorWithPrompt}
          initialBasePrompt={promptForAlchemist}
          onInitialBasePromptLoaded={() => setPromptForAlchemist(null)}
        />;
      default:
        return <Dashboard history={history} t={t} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      <Sidebar currentView={view} onSetView={setView} t={t} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header t={t} />
        <main className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';
import Dashboard from './components/Dashboard';
import ThemeCustomizer from './components/ThemeCustomizer';
import { Page, Prompt, HistoryItem } from './types';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from './hooks/useTheme';

function App() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('editor');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const savedPrompts = localStorage.getItem('prompts');
      if (savedPrompts) {
        setPrompts(JSON.parse(savedPrompts));
      }
      const savedHistory = localStorage.getItem('history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory).map((item: HistoryItem) => ({ ...item, timestamp: new Date(item.timestamp) })));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('prompts', JSON.stringify(prompts));
    } catch (error) {
      console.error("Failed to save prompts to localStorage", error);
    }
  }, [prompts]);

  useEffect(() => {
    try {
      localStorage.setItem('history', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const handleSavePrompt = (name: string, text: string) => {
    const newPrompt: Prompt = { id: uuidv4(), name, text };
    setPrompts([newPrompt, ...prompts]);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const handleAddHistory = (prompt: string, response: string, alignment_notes?: string) => {
    const newHistoryItem: HistoryItem = { id: uuidv4(), prompt, response, timestamp: new Date(), alignment_notes };
    setHistory([newHistoryItem, ...history]);
  };
  
  const handleDeleteHistory = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header t={t} />
        <main className="flex-1 overflow-y-auto p-8">
          {currentPage === 'editor' && (
            <PromptEditor
              prompts={prompts}
              history={history}
              onSavePrompt={handleSavePrompt}
              onDeletePrompt={handleDeletePrompt}
              onAddHistory={handleAddHistory}
              onDeleteHistory={handleDeleteHistory}
              t={t}
            />
          )}
          {currentPage === 'dashboard' && <Dashboard history={history} t={t} />}
          {currentPage === 'theme' && <ThemeCustomizer />}
        </main>
      </div>
    </div>
  );
}

export default App;
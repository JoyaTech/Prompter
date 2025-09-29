import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';
import OutputDisplay from './components/OutputDisplay';
import SavedPrompts from './components/SavedPrompts';
import History from './components/History';
import { streamRefinePrompt } from './services/geminiService';
import { Prompt, HistoryItem, AppState } from './types';

// FIX: Implement the App component to resolve placeholder content errors and build the application UI.
function App() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedPrompts = localStorage.getItem('savedPrompts');
      if (storedPrompts) {
        setSavedPrompts(JSON.parse(storedPrompts));
      }
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(parsedHistory);
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  // Save prompts to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    } catch (e) {
      console.error("Failed to save prompts to localStorage", e);
    }
  }, [savedPrompts]);

  // Save history to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const handlePromptSubmit = async (prompt: string) => {
    setAppState(AppState.LOADING);
    setOutput('');
    setError(null);
    let fullResponse = '';

    try {
      setAppState(AppState.STREAMING);
      for await (const chunk of streamRefinePrompt(prompt)) {
        fullResponse += chunk;
        setOutput(fullResponse);
      }
      
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        prompt: prompt,
        response: fullResponse,
        timestamp: new Date(),
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep last 20 items
      
      setAppState(AppState.SUCCESS);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setAppState(AppState.ERROR);
    }
  };

  const handleSavePrompt = (name: string, text: string) => {
    const newPrompt: Prompt = { id: crypto.randomUUID(), name, text };
    setSavedPrompts(prev => [newPrompt, ...prev]);
  };
  
  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  }
  
  const handleSelectHistory = (prompt: string, response: string) => {
      setOutput(response);
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-200">Your Prompt</h2>
              <PromptEditor 
                onPromptSubmit={handlePromptSubmit} 
                onSavePrompt={handleSavePrompt} 
                appState={appState} 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-200">Perfected Prompt</h2>
              <OutputDisplay output={output} appState={appState} error={error} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SavedPrompts
              prompts={savedPrompts}
              onSelectPrompt={handlePromptSubmit}
              onDeletePrompt={handleDeletePrompt}
            />
            <History 
              history={history}
              onSelectHistory={handleSelectHistory}
              onDeleteHistory={handleDeleteHistory}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

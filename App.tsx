import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';
import SavedPrompts from './components/SavedPrompts';
import History from './components/History';
import { improvePromptStream } from './services/geminiService';
import { Status, SavedPrompt } from './types';

// A simple hook to sync state with localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}


function App(): React.ReactElement {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [error, setError] = useState<string | null>(null);

  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>('savedPrompts', []);
  const [history, setHistory] = useLocalStorage<SavedPrompt[]>('promptHistory', []);
  
  const resetState = () => {
    setOriginalPrompt('');
    setImprovedPrompt('');
    setStatus(Status.IDLE);
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!originalPrompt.trim()) return;

    setStatus(Status.LOADING);
    setImprovedPrompt('');
    setError(null);

    try {
      let fullResponse = '';
      const stream = improvePromptStream(originalPrompt);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setImprovedPrompt(fullResponse);
      }

      const newHistoryItem: SavedPrompt = {
        id: new Date().toISOString() + Math.random(),
        original: originalPrompt,
        improved: fullResponse,
        timestamp: Date.now(),
      };

      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep history to 20 items
      setStatus(Status.SUCCESS);

    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setStatus(Status.ERROR);
    }
  }, [originalPrompt, setHistory]);

  const handleSave = () => {
    if (!improvedPrompt.trim() || !originalPrompt.trim()) return;

    const isAlreadySaved = savedPrompts.some(p => p.improved === improvedPrompt && p.original === originalPrompt);
    if (isAlreadySaved) {
        // Maybe show a notification in a real app
        console.log("Prompt already saved.");
        return;
    }
    
    const newSavedPrompt: SavedPrompt = {
      id: new Date().toISOString() + Math.random(),
      original: originalPrompt,
      improved: improvedPrompt,
      timestamp: Date.now(),
    };
    setSavedPrompts(prev => [newSavedPrompt, ...prev]);
  };
  
  const handleUsePrompt = (prompt: SavedPrompt) => {
      setOriginalPrompt(prompt.original);
      setImprovedPrompt(prompt.improved);
      setStatus(Status.SUCCESS); // Set to success as we have the improved prompt
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteSaved = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };
  
  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(p => p.id !== id));
  };
  
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <main className="container mx-auto px-4 py-10 md:py-16 max-w-5xl">
        <Header />
        <PromptEditor
          originalPrompt={originalPrompt}
          setOriginalPrompt={setOriginalPrompt}
          improvedPrompt={improvedPrompt}
          status={status}
          error={error}
          handleSubmit={handleSubmit}
          handleSave={handleSave}
          handleReset={resetState}
        />
        <SavedPrompts 
            prompts={savedPrompts}
            onUse={handleUsePrompt}
            onDelete={handleDeleteSaved}
        />
        <History 
            prompts={history}
            onUse={handleUsePrompt}
            onDelete={handleDeleteHistoryItem}
            onClear={handleClearHistory}
        />
      </main>
    </div>
  );
}

export default App;

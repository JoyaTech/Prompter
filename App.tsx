import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';
import OutputDisplay from './components/OutputDisplay';
import { refinePrompt } from './services/geminiService';
import { HistoryItem, Prompt } from './types';
import SavedPrompts from './components/SavedPrompts';
import History from './components/History';

function App() {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'quick' | 'deep'>('quick');
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(parsedHistory);
      }
      const storedPrompts = localStorage.getItem('savedPrompts');
      if (storedPrompts) {
        setSavedPrompts(JSON.parse(storedPrompts));
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    } catch(e) {
      console.error("Failed to save prompts to localStorage", e);
    }
  }, [savedPrompts]);

  const handleRefine = async (promptToRefine: string) => {
    setIsLoading(true);
    setError(null);
    setRefinedPrompt('');

    try {
      const result = await refinePrompt(promptToRefine, mode);
      setRefinedPrompt(result);
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        prompt: promptToRefine,
        response: result,
        timestamp: new Date(),
      };
      // Keep history to a max of 10 items
      setHistory([newHistoryItem, ...history].slice(0, 10));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrompt = () => {
    if (!refinedPrompt) return;
    const name = prompt('Enter a name for this prompt:') || `Saved Prompt ${savedPrompts.length + 1}`;
    if (name) {
      const newPrompt: Prompt = {
        id: new Date().toISOString(),
        name,
        text: refinedPrompt,
      };
      setSavedPrompts([newPrompt, ...savedPrompts]);
    }
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(savedPrompts.filter(p => p.id !== id));
  };

  const handleSelectPrompt = (promptText: string) => {
    setRefinedPrompt(promptText);
    setOriginalPrompt(''); 
  };
  
  const handleDeleteHistory = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const handleSelectHistory = (prompt: string, response: string) => {
    setOriginalPrompt(prompt);
    setRefinedPrompt(response);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">1. Your Idea</h2>
              <PromptEditor 
                onSubmit={handleRefine}
                isLoading={isLoading}
                prompt={originalPrompt}
                setPrompt={setOriginalPrompt}
                mode={mode}
                setMode={setMode}
              />
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">2. Refined Prompt</h2>
              <OutputDisplay 
                refinedPrompt={refinedPrompt}
                isLoading={isLoading}
                error={error}
                onSave={handleSavePrompt}
              />
            </section>
          </div>
          <aside className="space-y-8">
            <section>
              <SavedPrompts
                prompts={savedPrompts}
                onSelectPrompt={handleSelectPrompt}
                onDeletePrompt={handleDeletePrompt}
              />
            </section>
            <section>
               <History 
                history={history}
                onSelectHistory={handleSelectHistory}
                onDeleteHistory={handleDeleteHistory}
               />
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
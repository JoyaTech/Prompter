// App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';
import OutputDisplay from './components/OutputDisplay';
import { Language, Mode, Prompt, HistoryItem, TargetModel } from './types';
import { useTranslation } from './i18n';
import { refinePrompt } from './services/geminiService';

function App() {
  // Internationalization
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const t = useTranslation(currentLang);
  
  // App State
  const [userPrompt, setUserPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [mode, setMode] = useState<Mode>('quick');
  const [targetModel, setTargetModel] = useState<TargetModel>('Generic-LLM');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local Storage State
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedPrompts = localStorage.getItem('savedPrompts');
      if (storedPrompts) setSavedPrompts(JSON.parse(storedPrompts));

      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
         setHistory(JSON.parse(storedHistory).map((item: any) => ({
             ...item,
             timestamp: new Date(item.timestamp)
         })));
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(history));
  }, [history]);

  const handleRefine = useCallback(async () => {
    if (!userPrompt.trim()) {
      setError(t('error_empty_prompt'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setRefinedPrompt('');
    try {
      const result = await refinePrompt(userPrompt, currentLang, mode, targetModel);
      setRefinedPrompt(result);
      // Add to history
      const newHistoryItem: HistoryItem = {
          id: uuidv4(),
          prompt: userPrompt,
          response: result,
          timestamp: new Date(),
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]); // Keep history to 50 items
    } catch (e: any) {
      setError(e.message || t('error_generic'));
    } finally {
      setIsLoading(false);
    }
  }, [userPrompt, currentLang, mode, targetModel, t]);

  const handleSavePrompt = useCallback(() => {
    if (!refinedPrompt.trim()) return;
    const promptName = prompt("Enter a name for this prompt:", refinedPrompt.substring(0, 30) + '...');
    if (promptName) {
        const newPrompt: Prompt = {
            id: uuidv4(),
            name: promptName,
            text: refinedPrompt,
        };
        setSavedPrompts(prev => [newPrompt, ...prev]);
    }
  }, [refinedPrompt]);

  const handleDeletePrompt = useCallback((id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleSelectPrompt = useCallback((promptText: string) => {
    setUserPrompt(promptText);
    setRefinedPrompt('');
    setError(null);
  }, []);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  }, []);

  const handleSelectHistory = useCallback((prompt: string, response: string) => {
      setUserPrompt(prompt);
      setRefinedPrompt(response);
      setError(null);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-900 text-white font-sans ${currentLang === 'he' ? 'rtl' : 'ltr'}`}>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Header currentLang={currentLang} setLang={setCurrentLang} t={t} />
        <div className="space-y-8">
            <PromptEditor 
                userPrompt={userPrompt}
                setUserPrompt={setUserPrompt}
                mode={mode}
                setMode={setMode}
                targetModel={targetModel}
                setTargetModel={setTargetModel}
                onRefine={handleRefine}
                isLoading={isLoading}
                t={t}
                savedPrompts={savedPrompts}
                onSelectPrompt={handleSelectPrompt}
                onDeletePrompt={handleDeletePrompt}
                history={history}
                onSelectHistory={handleSelectHistory}
                onDeleteHistory={handleDeleteHistory}
            />
            <OutputDisplay 
                refinedPrompt={refinedPrompt}
                isLoading={isLoading}
                error={error}
                onSave={handleSavePrompt}
                t={t}
            />
        </div>
      </main>
    </div>
  );
}

export default App;

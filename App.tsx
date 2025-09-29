
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';
import OutputDisplay from './components/OutputDisplay';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { refinePrompt, DeepModeResponse } from './services/geminiService';
import { Mode, TargetModel, Prompt, HistoryItem, Language, Page } from './types';
import { setLocale, t } from './i18n';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

function App(): React.ReactElement {
  const [userPrompt, setUserPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('quick');
  const [targetModel, setTargetModel] = useState<TargetModel>('Generic-LLM');
  
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState<Page>('editor');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('flowit_prompts');
      if (saved) setSavedPrompts(JSON.parse(saved));
      
      const savedHistory = localStorage.getItem('flowit_history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(parsedHistory);
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flowit_prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    localStorage.setItem('flowit_history', JSON.stringify(history));
  }, [history]);

  const handleRefine = useCallback(async () => {
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setRefinedPrompt('');

    try {
      const result = await refinePrompt(userPrompt, mode, targetModel, currentLang);
      
      let promptResponse: string;
      let notes: string | undefined = undefined;
      let topics: string[] | undefined = undefined;
      
      if (typeof result === 'object' && 'refined_prompt' in result) {
          promptResponse = (result as DeepModeResponse).refined_prompt;
          notes = (result as DeepModeResponse).alignment_notes;
          topics = (result as DeepModeResponse).topics;
      } else if (typeof result === 'string') {
          promptResponse = result;
      } else {
          throw new Error("Invalid response format from refine service");
      }
      
      if (promptResponse.startsWith('Error:')) {
        setError(promptResponse);
        setRefinedPrompt('');
      } else {
        setRefinedPrompt(promptResponse);
        const newHistoryItem: HistoryItem = {
          id: generateId(),
          prompt: userPrompt,
          response: promptResponse,
          timestamp: new Date(),
          ...(notes && { alignment_notes: notes }),
          ...(topics && { topics: topics }),
        };
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      setRefinedPrompt('');
    } finally {
      setIsLoading(false);
    }
  }, [userPrompt, mode, targetModel, currentLang]);

  const handleSavePrompt = () => {
    if (!refinedPrompt) return;
    const name = prompt(t('enter_prompt_name'), refinedPrompt.substring(0, 30));
    if (name) {
      const newPrompt: Prompt = {
        id: generateId(),
        name,
        text: refinedPrompt,
      };
      setSavedPrompts(prev => [newPrompt, ...prev]);
    }
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(prompts => prompts.filter(p => p.id !== id));
  };
  
  const handleSelectPrompt = (promptText: string) => {
    setUserPrompt(promptText);
    setRefinedPrompt('');
    setCurrentPage('editor');
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(h => h.filter(item => item.id !== id));
  };

  const handleSelectHistory = (prompt: string, response: string) => {
    setUserPrompt(prompt);
    setRefinedPrompt(response);
    setCurrentPage('editor');
  };
  
  const setLang = (lang: Language) => {
      setLocale(lang);
      setCurrentLang(lang);
      document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
  }

  const renderContent = () => {
    if (currentPage === 'dashboard') {
      return <Dashboard history={history} t={t} />;
    }
    return (
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
    );
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white font-sans ${currentLang === 'he' ? 'font-hebrew' : ''}`}>
      <div className="flex h-screen">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} />
          <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
             <Header currentLang={currentLang} setLang={setLang} t={t} />
             {renderContent()}
             <footer className="text-center mt-12 text-gray-500 text-sm">
                <p>Powered by Google Gemini.</p>
             </footer>
          </main>
      </div>
    </div>
  );
}

export default App;
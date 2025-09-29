// FIX: Implemented the main App component to manage state and application structure.
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromptEditor from './components/PromptEditor';
import Dashboard from './components/Dashboard';
import { getTranslator } from './i18n';
import { Language, Page, Prompt, HistoryItem } from './types';
import { refinePrompt } from './services/geminiService';

const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('en');
    const [currentPage, setCurrentPage] = useState<Page>('editor');
    const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const t = useCallback(getTranslator(lang), [lang]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('flowit_prompts');
            if (saved) setSavedPrompts(JSON.parse(saved));
            
            const historySaved = localStorage.getItem('flowit_history');
            if (historySaved) {
                // Parse dates from string
                const parsedHistory = JSON.parse(historySaved).map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp),
                }));
                setHistory(parsedHistory);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('flowit_prompts', JSON.stringify(savedPrompts));
        } catch (error) {
            console.error("Failed to save prompts to localStorage", error);
        }
    }, [savedPrompts]);

    useEffect(() => {
        try {
            localStorage.setItem('flowit_history', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    }, [history]);

    const handleRefinePrompt = async (prompt: string) => {
        const result = await refinePrompt(prompt);
        const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            prompt,
            response: result.refinedPrompt,
            timestamp: new Date(),
            alignment_notes: result.alignmentNotes,
            topics: result.topics,
        };
        setHistory(prev => [newHistoryItem, ...prev]);
        return result;
    };

    const handleSavePrompt = (prompt: Prompt) => {
        setSavedPrompts(prev => [prompt, ...prev.filter(p => p.id !== prompt.id)]);
    };

    const handleDeletePrompt = (id: string) => {
        setSavedPrompts(prev => prev.filter(p => p.id !== id));
    };
    
    const handleDeleteHistory = (id: string) => {
        setHistory(prev => prev.filter(h => h.id !== id));
    };

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="flex">
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} />
                <main className="flex-1 p-6 sm:p-10">
                    <Header currentLang={lang} setLang={handleSetLang} t={t} />
                    {currentPage === 'editor' && (
                        <PromptEditor
                            onRefine={handleRefinePrompt}
                            onSavePrompt={handleSavePrompt}
                            onDeletePrompt={handleDeletePrompt}
                            onDeleteHistory={handleDeleteHistory}
                            savedPrompts={savedPrompts}
                            history={history}
                            t={t}
                        />
                    )}
                    {currentPage === 'dashboard' && <Dashboard history={history} t={t} />}
                </main>
            </div>
        </div>
    );
};

export default App;

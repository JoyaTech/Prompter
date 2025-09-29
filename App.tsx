// FIX: Updated App.tsx to manage TemplateFields, File state, and pass them to PromptEditor and the service.
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromptEditor from './components/PromptEditor';
import Dashboard from './components/Dashboard';
import { getTranslator } from './i18n';
import { Language, Page, Prompt, HistoryItem, TemplateFields, Mode, TargetModel } from './types';
import { refinePrompt, RefinedPromptResponse } from './services/geminiService';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('en');
    const [currentPage, setCurrentPage] = useState<Page>('editor');
    const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [mode, setMode] = useState<Mode>('quick');
    const [targetModel, setTargetModel] = useState<TargetModel>('Generic-LLM');

    // State for Quick Mode input
    const [prompt, setPrompt] = useState('');
    
    // State for Deep Mode (Template Builder)
    const [templateFields, setTemplateFields] = useState<TemplateFields>({
        role: '', task: '', context: '', constraints: '',
    });

    // State for RAG (File Upload)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const t = useCallback(getTranslator(lang), [lang]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('flowit_prompts');
            if (saved) setSavedPrompts(JSON.parse(saved));
            
            const historySaved = localStorage.getItem('flowit_history');
            if (historySaved) {
                setHistory(JSON.parse(historySaved).map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
            }
        } catch (error) { console.error("Failed to load data from localStorage", error); }
    }, []);

    useEffect(() => {
        localStorage.setItem('flowit_prompts', JSON.stringify(savedPrompts));
    }, [savedPrompts]);

    useEffect(() => {
        localStorage.setItem('flowit_history', JSON.stringify(history));
    }, [history]);

    const buildPromptFromFields = (): string => {
        const { role, task, context, constraints } = templateFields;
        const structuredPart = `ROLE: ${role}\nTASK: ${task}\nCONTEXT: ${context}\nCONSTRAINTS: ${constraints}`;
        return `${structuredPart}\n\nAdditional Instructions: ${prompt}`;
    };

    const handleRefinePrompt = async (): Promise<RefinedPromptResponse> => {
        const promptToRefine = mode === 'deep' ? buildPromptFromFields() : prompt;
        
        const result = await refinePrompt(promptToRefine, mode, targetModel, lang, uploadedFile);

        const newHistoryItem: HistoryItem = {
            id: generateId(),
            prompt: promptToRefine,
            response: result.refinedPrompt,
            timestamp: new Date(),
            alignment_notes: result.alignmentNotes,
            topics: result.topics,
        };
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
        return result;
    };

    const handleSavePrompt = (promptText: string) => {
        const name = promptText.split(' ').slice(0, 5).join(' ') + '...';
        const newPrompt = { id: generateId(), name, text: promptText };
        setSavedPrompts(prev => [newPrompt, ...prev.filter(p => p.id !== newPrompt.id)]);
    };

    const handleDeletePrompt = (id: string) => setSavedPrompts(prev => prev.filter(p => p.id !== id));
    const handleDeleteHistory = (id: string) => setHistory(prev => prev.filter(h => h.id !== h.id));

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
    };

    const handleSetFile = (file: File | null) => {
        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
            alert(t('file_too_large'));
            setUploadedFile(null);
        } else {
            setUploadedFile(file);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="flex h-screen">
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} />
                <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
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
                            mode={mode}
                            setMode={setMode}
                            targetModel={targetModel}
                            setTargetModel={setTargetModel}
                            prompt={prompt}
                            setPrompt={setPrompt}
                            templateFields={templateFields}
                            setTemplateFields={setTemplateFields}
                            uploadedFile={uploadedFile}
                            onSetFile={handleSetFile}
                        />
                    )}
                    {currentPage === 'dashboard' && <Dashboard history={history} t={t} />}
                </main>
            </div>
        </div>
    );
};

export default App;
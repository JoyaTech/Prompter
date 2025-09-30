import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './AppContext';
import { HistoryItem } from '../types';
import OutputDisplay from './OutputDisplay';
import { RefreshCwIcon, SaveIcon } from './icons';
import { generateContent } from '../services/geminiService';
import SavePromptModal from './SavePromptModal';

const ComparisonEditor: React.FC = () => {
    const { t } = useTranslation();
    const { handleSaveHistory, handleUpdateHistory } = useAppContext();

    const [promptA, setPromptA] = useState('');
    const [promptB, setPromptB] = useState('');
    const [outputA, setOutputA] = useState('');
    const [outputB, setOutputB] = useState('');
    const [isLoading, setIsLoading] = useState<'A' | 'B' | 'both' | null>(null);
    const [historyItemA, setHistoryItemA] = useState<HistoryItem | null>(null);
    const [historyItemB, setHistoryItemB] = useState<HistoryItem | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<'A' | 'B' | null>(null);

    const handleGenerate = async (variant: 'A' | 'B') => {
        const prompt = variant === 'A' ? promptA : promptB;
        if (!prompt) return;

        setIsLoading(variant);
        const setOutput = variant === 'A' ? setOutputA : setOutputB;
        const setHistoryItem = variant === 'A' ? setHistoryItemA : setHistoryItemB;
        setOutput('');
        setHistoryItem(null);

        try {
            const response = await generateContent(prompt);
            setOutput(response.text);
            const newHistoryItem = handleSaveHistory(prompt, response.text);
            setHistoryItem(newHistoryItem);
        } catch (error) {
            console.error(`Content generation for ${variant} failed:`, error);
            setOutput("An error occurred while generating the response.");
        } finally {
            setIsLoading(null);
        }
    };

    const handleGenerateBoth = async () => {
        setIsLoading('both');
        await Promise.all([handleGenerate('A'), handleGenerate('B')]);
        setIsLoading(null);
    };

    const handleUpdateHistoryItem = (id: string, updates: Partial<HistoryItem>) => {
        handleUpdateHistory(id, updates);
        if (historyItemA?.id === id) {
            setHistoryItemA(prev => prev ? { ...prev, ...updates } : null);
        }
        if (historyItemB?.id === id) {
            setHistoryItemB(prev => prev ? { ...prev, ...updates } : null);
        }
    };
    
    const declareWinner = (prompt: string) => {
        // Here you could implement logic to save the winning prompt,
        // potentially marking it in history or adding to saved prompts.
        // For now, we'll just open the save modal.
        if (prompt === promptA) {
            setIsSaveModalOpen('A');
        } else {
            setIsSaveModalOpen('B');
        }
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-shrink-0 flex justify-end">
                <button
                    onClick={handleGenerateBoth}
                    disabled={!!isLoading || !promptA || !promptB}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
                >
                    <RefreshCwIcon className={`w-5 h-5 ${isLoading === 'both' ? 'animate-spin' : ''}`} />
                    {isLoading === 'both' ? t('status_generating') : 'Generate Both'}
                </button>
            </div>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prompt A */}
                <div className="flex flex-col gap-4">
                    <div className="bg-card p-4 rounded-lg border border-border-color flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-text-main">Prompt A</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsSaveModalOpen('A')} className="p-2 text-text-secondary hover:text-primary transition-colors" title={t('save_prompt')}><SaveIcon className="w-5 h-5" /></button>
                                <button onClick={() => handleGenerate('A')} disabled={!!isLoading || !promptA} className="px-3 py-1.5 text-sm bg-primary/20 text-primary hover:bg-primary/30 rounded-md disabled:opacity-50">Generate</button>
                            </div>
                        </div>
                        <textarea value={promptA} onChange={e => setPromptA(e.target.value)} className="w-full h-32 p-2 bg-background border border-border-color rounded-md resize-none font-mono" />
                    </div>
                    <OutputDisplay
                        output={outputA}
                        isLoading={isLoading === 'A' || isLoading === 'both'}
                        prompt={promptA}
                        historyItem={historyItemA}
                        onUpdateHistoryItem={handleUpdateHistoryItem}
                        onDeclareWinner={declareWinner}
                        competingRating={historyItemB?.rating}
                    />
                </div>

                {/* Prompt B */}
                <div className="flex flex-col gap-4">
                    <div className="bg-card p-4 rounded-lg border border-border-color flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-text-main">Prompt B</h3>
                             <div className="flex items-center gap-2">
                                <button onClick={() => setIsSaveModalOpen('B')} className="p-2 text-text-secondary hover:text-primary transition-colors" title={t('save_prompt')}><SaveIcon className="w-5 h-5" /></button>
                                <button onClick={() => handleGenerate('B')} disabled={!!isLoading || !promptB} className="px-3 py-1.5 text-sm bg-primary/20 text-primary hover:bg-primary/30 rounded-md disabled:opacity-50">Generate</button>
                            </div>
                        </div>
                        <textarea value={promptB} onChange={e => setPromptB(e.target.value)} className="w-full h-32 p-2 bg-background border border-border-color rounded-md resize-none font-mono" />
                    </div>
                     <OutputDisplay
                        output={outputB}
                        isLoading={isLoading === 'B' || isLoading === 'both'}
                        prompt={promptB}
                        historyItem={historyItemB}
                        onUpdateHistoryItem={handleUpdateHistoryItem}
                        onDeclareWinner={declareWinner}
                        competingRating={historyItemA?.rating}
                    />
                </div>
            </div>
            {isSaveModalOpen && (
                <SavePromptModal
                    isOpen={!!isSaveModalOpen}
                    onClose={() => setIsSaveModalOpen(null)}
                    promptText={isSaveModalOpen === 'A' ? promptA : promptB}
                />
            )}
        </div>
    );
};

export default ComparisonEditor;

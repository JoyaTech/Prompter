import React, { useState } from 'react';
import { Essence } from '../types';
import { blendPrompt } from '../services/geminiService';
import { TrashIcon, SparklesIcon, SaveIcon, EditIcon } from './icons';
import CopyButton from './CopyButton';

interface AlchemistWorkbenchProps {
    t: (key: string) => string;
    basePrompt: string;
    essences: Essence[];
    onUpdateBasePrompt: (prompt: string) => void;
    onUpdateEssences: (essences: Essence[]) => void;
    onClearWorkbench: () => void;
    onSavePrompt: (name: string, text: string) => void;
    onRefineInIDE: (prompt: string) => void;
}

const AlchemistWorkbench: React.FC<AlchemistWorkbenchProps> = ({ 
    t, 
    basePrompt, 
    essences,
    onUpdateBasePrompt,
    onUpdateEssences,
    onClearWorkbench,
    onSavePrompt,
    onRefineInIDE
}) => {
    const [brewedPrompt, setBrewedPrompt] = useState('');
    const [isBrewing, setIsBrewing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleRemoveEssence = (id: string) => {
        onUpdateEssences(essences.filter(e => e.id !== id));
    };

    const handleBrew = async () => {
        if (!basePrompt) return;
        setIsBrewing(true);
        setError(null);
        setBrewedPrompt('');
        try {
            const result = await blendPrompt(basePrompt, essences.map(e => e.text));
            setBrewedPrompt(result.text);
        } catch (err) {
            console.error("Failed to brew prompt:", err);
            setError("Failed to brew prompt. Please try again.");
        }
        setIsBrewing(false);
    };

    const handleSaveBrewedPrompt = () => {
        if (!brewedPrompt) return;
        const name = prompt(t('prompt_name_prompt'), "Brewed: " + basePrompt.substring(0, 20) + '...');
        if (name) {
            onSavePrompt(name, brewedPrompt);
        }
    };

    if (!basePrompt && essences.length === 0) {
        return (
             <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
                <h3 className="text-lg font-semibold text-text-main mb-4">{t('alchemist_workbench_title')}</h3>
                <div className="flex items-center justify-center flex-grow border-2 border-dashed border-border-color rounded-md">
                    <p className="text-text-secondary text-center max-w-xs">{t('alchemist_workbench_empty')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-main">{t('alchemist_workbench_title')}</h3>
                <button onClick={onClearWorkbench} className="text-xs text-text-secondary hover:text-red-400 font-semibold">
                    {t('alchemist_clear_workbench')}
                </button>
            </div>
            
            <div className="grid grid-rows-2 gap-4 flex-grow">
                {/* Top Half: Ingredients */}
                <div className="grid grid-cols-2 gap-4 overflow-hidden">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-secondary">{t('alchemist_base_prompt')}</label>
                        <textarea 
                            value={basePrompt}
                            onChange={(e) => onUpdateBasePrompt(e.target.value)}
                            placeholder="Add a base prompt from the library or type here..."
                            className="w-full h-full p-2 bg-background border border-border-color rounded-md text-sm resize-none"
                        />
                    </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-secondary">{t('alchemist_essences')} ({essences.length})</label>
                        <div className="overflow-y-auto pr-2 space-y-2 h-full bg-background border border-border-color rounded-md p-2">
                            {essences.map(e => (
                                <div key={e.id} className="group flex items-center justify-between p-2 bg-card-secondary rounded text-sm">
                                    <p className="truncate text-text-main">{e.text}</p>
                                    <button onClick={() => handleRemoveEssence(e.id)} className="ml-2 p-1 text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                            {essences.length === 0 && <p className="text-xs text-text-secondary/70 p-2">Add more prompts from the library to blend as essences.</p>}
                        </div>
                    </div>
                </div>

                {/* Bottom Half: Brewing and Result */}
                <div className="flex flex-col gap-3">
                    <div className="flex-shrink-0">
                         <button 
                            onClick={handleBrew} 
                            disabled={isBrewing || !basePrompt} 
                            className="w-full px-4 py-2 bg-primary rounded disabled:bg-opacity-50 text-white font-semibold flex items-center justify-center gap-2"
                        >
                            <SparklesIcon className="w-5 h-5"/>
                            {isBrewing ? t('alchemist_brewing_button') : t('alchemist_brew_button')}
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 flex-grow">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-text-secondary">{t('alchemist_brewed_result')}</label>
                            {brewedPrompt && !isBrewing && (
                                <div className="flex items-center gap-2">
                                    <CopyButton textToCopy={brewedPrompt} />
                                    <button onClick={handleSaveBrewedPrompt} className="px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 bg-card-secondary text-text-secondary hover:bg-border-color hover:text-text-main">
                                        <SaveIcon className="w-4 h-4"/>
                                        {t('alchemist_save_brewed')}
                                    </button>
                                    <button onClick={() => onRefineInIDE(brewedPrompt)} className="px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 bg-card-secondary text-text-secondary hover:bg-border-color hover:text-text-main">
                                        <EditIcon className="w-4 h-4"/>
                                        {t('alchemist_refine_in_ide')}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="w-full h-full p-3 bg-background border border-border-color rounded-md text-sm overflow-y-auto">
                            {isBrewing && <p className="text-text-secondary animate-pulse">Brewing a new prompt...</p>}
                            {error && <p className="text-red-400">{error}</p>}
                            {brewedPrompt && <p className="whitespace-pre-wrap text-text-main">{brewedPrompt}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlchemistWorkbench;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Essence, PromptComponent } from '../types';
import { blendPrompt } from '../services/geminiService';
import { SparklesIcon, TrashIcon, PlusIcon } from './icons';

interface AlchemistWorkbenchProps {
    basePrompt: string;
    essences: Essence[];
    onUpdateBasePrompt: (prompt: string) => void;
    onUpdateEssences: (essences: Essence[]) => void;
    onClearWorkbench: () => void;
    onSavePrompt: (name: string, text: string) => void;
    onRefineInIDE: (prompt: string) => void;
}

const AlchemistWorkbench: React.FC<AlchemistWorkbenchProps> = ({
    basePrompt,
    essences,
    onUpdateBasePrompt,
    onUpdateEssences,
    onClearWorkbench,
    onSavePrompt,
    onRefineInIDE
}) => {
    const { t } = useTranslation();
    const [blendedPrompt, setBlendedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleBlend = async () => {
        if (!basePrompt) return;
        setIsLoading(true);
        try {
            const response = await blendPrompt(basePrompt, essences.map(e => e.text));
            setBlendedPrompt(response.text ?? '');
        } catch (error) {
            console.error(error);
            setBlendedPrompt("Error blending prompt.");
        }
        setIsLoading(false);
    };

    const addEssence = () => onUpdateEssences([...essences, { id: uuidv4(), text: '' }]);
    const updateEssence = (id: string, text: string) => onUpdateEssences(essences.map(e => e.id === id ? { ...e, text } : e));
    const removeEssence = (id: string) => onUpdateEssences(essences.filter(e => e.id !== id));
    
    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
            <h3 className="text-lg font-semibold text-text-main mb-3">{t('alchemist_workbench_title')}</h3>
            <div className="grid grid-cols-2 gap-4 flex-grow overflow-y-auto">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-text-secondary mb-2 block">{t('alchemist_workbench_base')}</label>
                        <textarea value={basePrompt} onChange={e => onUpdateBasePrompt(e.target.value)} placeholder={t('alchemist_workbench_base_placeholder')} className="w-full h-32 p-2 bg-background border border-border-color rounded-md text-sm resize-y" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-text-secondary mb-2 block">{t('alchemist_workbench_essences')}</label>
                        <div className="space-y-2">
                            {essences.map(essence => (
                                <div key={essence.id} className="flex items-center gap-2">
                                    <input value={essence.text} onChange={e => updateEssence(essence.id, e.target.value)} className="w-full p-2 bg-background border border-border-color rounded-md text-sm" />
                                    <button onClick={() => removeEssence(essence.id)} className="p-2 text-text-secondary hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={addEssence} className="mt-2 flex items-center gap-2 text-sm text-accent"><PlusIcon className="w-4 h-4"/> Add Essence</button>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-text-secondary mb-2 block">{t('alchemist_workbench_result')}</label>
                    <div className="flex-grow bg-background p-3 rounded-md border border-border-color text-sm whitespace-pre-wrap overflow-y-auto">
                        {blendedPrompt}
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border-color flex justify-between items-center">
                <button onClick={onClearWorkbench} className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-main">{t('alchemist_workbench_clear')}</button>
                <div className="flex items-center gap-3">
                    <button onClick={() => onRefineInIDE(blendedPrompt)} disabled={!blendedPrompt} className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-main disabled:opacity-50">Refine in IDE</button>
                    <button onClick={handleBlend} disabled={isLoading || !basePrompt} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 disabled:bg-primary/50 flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5"/>
                        {isLoading ? t('alchemist_workbench_blending') : t('alchemist_workbench_blend')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlchemistWorkbench;

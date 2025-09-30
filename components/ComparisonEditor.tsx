import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HistoryItem, PromptComponent } from '../types';
import { generateContent, generatePromptVariations } from '../services/geminiService';
import VisualPromptBuilder from './VisualPromptBuilder';
import OutputDisplay from './OutputDisplay';
import { SparklesIcon } from './icons';

interface ComparisonEditorProps {
    onAddHistory: (prompt: string, response: string, alignmentNotes?: string, comparisonId?: string) => HistoryItem;
    onUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
    onSavePrompt: (name: string, text: string) => void;
    t: (key: string) => string;
}

const GenerateVariationsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (idea: string) => Promise<void>;
    t: (key: string) => string;
}> = ({ isOpen, onClose, onGenerate, t }) => {
    const [idea, setIdea] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!idea.trim()) return;
        setIsGenerating(true);
        await onGenerate(idea);
        setIsGenerating(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-card border border-border-color rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-text-main">{t('variations_modal_title')}</h2>
                <p className="text-sm text-text-secondary">{t('variations_modal_desc')}</p>
                <div>
                    <label htmlFor="idea-input" className="block text-sm font-medium text-text-secondary mb-1">{t('variations_modal_idea_label')}</label>
                    <textarea
                        id="idea-input"
                        value={idea}
                        onChange={e => setIdea(e.target.value)}
                        rows={4}
                        className="w-full p-2 bg-background border border-border-color rounded-md resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-main bg-card-secondary rounded-lg hover:bg-border-color">Cancel</button>
                    <button onClick={handleGenerate} disabled={isGenerating || !idea.trim()} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90 disabled:bg-primary/50">
                        {isGenerating ? t('button_generating') : t('variations_modal_generate_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ComparisonEditor: React.FC<ComparisonEditorProps> = ({ onAddHistory, onUpdateHistoryItem, onSavePrompt, t }) => {
    const [componentsA, setComponentsA] = useState<PromptComponent[]>([]);
    const [componentsB, setComponentsB] = useState<PromptComponent[]>([]);
    
    const [outputA, setOutputA] = useState('');
    const [outputB, setOutputB] = useState('');
    
    const [historyItemA, setHistoryItemA] = useState<HistoryItem | null>(null);
    const [historyItemB, setHistoryItemB] = useState<HistoryItem | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);

    const constructPrompt = (components: PromptComponent[]) => components.map(c => c.content).filter(Boolean).join('\n\n');

    const handleRunComparison = async () => {
        const promptA = constructPrompt(componentsA);
        const promptB = constructPrompt(componentsB);

        if (!promptA || !promptB) {
            setError('Both prompts must not be empty.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setOutputA('');
        setOutputB('');
        setHistoryItemA(null);
        setHistoryItemB(null);

        const comparisonId = uuidv4();

        try {
            const [responseA, responseB] = await Promise.all([
                generateContent(promptA),
                generateContent(promptB),
            ]);

            const responseTextA = responseA.text;
            const responseTextB = responseB.text;
            
            setOutputA(responseTextA);
            setOutputB(responseTextB);

            const newHistoryItemA = onAddHistory(promptA, responseTextA, undefined, comparisonId);
            const newHistoryItemB = onAddHistory(promptB, responseTextB, undefined, comparisonId);

            setHistoryItemA(newHistoryItemA);
            setHistoryItemB(newHistoryItemB);

        } catch (err) {
            console.error(err);
            setError(t('error_generation_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateVariations = async (idea: string) => {
        try {
            const { promptA, promptB } = await generatePromptVariations(idea);
            setComponentsA([{ id: uuidv4(), type: 'text', content: promptA }]);
            setComponentsB([{ id: uuidv4(), type: 'text', content: promptB }]);
        } catch (err) {
            console.error(err);
            setError("Failed to generate variations. Please try again.");
        }
    };
    
    const handleUpdateHistoryItemWrapper = (id: string, updates: Partial<HistoryItem>) => {
        onUpdateHistoryItem(id, updates);
        if (historyItemA?.id === id) {
            setHistoryItemA(prev => prev ? { ...prev, ...updates } : null);
        }
        if (historyItemB?.id === id) {
            setHistoryItemB(prev => prev ? { ...prev, ...updates } : null);
        }
    }
    
    const handleDeclareWinner = (promptText: string) => {
        const name = prompt(t('prompt_name_prompt'), t('comparison_winner_prompt_name'));
        if (name) {
            onSavePrompt(name, promptText);
        }
    };

    const promptA = constructPrompt(componentsA);
    const promptB = constructPrompt(componentsB);

    return (
        <>
        <div className="flex flex-col gap-6 h-full">
            <div className="flex-shrink-0 text-center">
                <button
                    onClick={() => setIsVariationModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors"
                >
                    {t('button_generate_variations')}
                </button>
            </div>

            <div className="flex-grow grid grid-cols-2 gap-6 overflow-hidden">
                {/* Prompt A */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-text-main text-center">{t('comparison_prompt_a')}</h3>
                    <VisualPromptBuilder components={componentsA} onComponentsChange={setComponentsA} t={t} />
                </div>
                {/* Prompt B */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-text-main text-center">{t('comparison_prompt_b')}</h3>
                    <VisualPromptBuilder components={componentsB} onComponentsChange={setComponentsB} t={t} />
                </div>
            </div>
            
            <div className="flex-shrink-0 text-center">
                 <button
                    onClick={handleRunComparison}
                    disabled={isLoading}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:opacity-90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? t('comparison_running') : t('comparison_run')}
                </button>
            </div>

            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
            
            <div className="flex-grow grid grid-cols-2 gap-6 overflow-hidden">
                 {/* Output A */}
                 <OutputDisplay
                    output={outputA}
                    isLoading={isLoading}
                    prompt={promptA}
                    historyItem={historyItemA}
                    onUpdateHistoryItem={handleUpdateHistoryItemWrapper}
                    onDeclareWinner={handleDeclareWinner}
                    competingRating={historyItemB?.rating}
                    t={t}
                />
                {/* Output B */}
                <OutputDisplay
                    output={outputB}
                    isLoading={isLoading}
                    prompt={promptB}
                    historyItem={historyItemB}
                    onUpdateHistoryItem={handleUpdateHistoryItemWrapper}
                    onDeclareWinner={handleDeclareWinner}
                    competingRating={historyItemA?.rating}
                    t={t}
                />
            </div>
        </div>
        <GenerateVariationsModal 
            isOpen={isVariationModalOpen}
            onClose={() => setIsVariationModalOpen(false)}
            onGenerate={handleGenerateVariations}
            t={t}
        />
        </>
    );
};

export default ComparisonEditor;
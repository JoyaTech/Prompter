import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HistoryItem, PromptComponent } from '../types';
import { generateContent } from '../services/geminiService';
import VisualPromptBuilder from './VisualPromptBuilder';
import OutputDisplay from './OutputDisplay';
import { SparklesIcon } from './icons';

interface ComparisonEditorProps {
    onAddHistory: (prompt: string, response: string, alignmentNotes?: string, comparisonId?: string) => HistoryItem;
    onUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
    t: (key: string) => string;
}

const ComparisonEditor: React.FC<ComparisonEditorProps> = ({ onAddHistory, onUpdateHistoryItem, t }) => {
    const [componentsA, setComponentsA] = useState<PromptComponent[]>([]);
    const [componentsB, setComponentsB] = useState<PromptComponent[]>([]);
    
    const [outputA, setOutputA] = useState('');
    const [outputB, setOutputB] = useState('');
    
    const [historyIdA, setHistoryIdA] = useState<string | null>(null);
    const [historyIdB, setHistoryIdB] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        setHistoryIdA(null);
        setHistoryIdB(null);

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

            setHistoryIdA(newHistoryItemA.id);
            setHistoryIdB(newHistoryItemB.id);

        } catch (err) {
            console.error(err);
            setError(t('error_generation_failed'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const promptA = constructPrompt(componentsA);
    const promptB = constructPrompt(componentsB);

    return (
        <div className="flex flex-col gap-6 h-full">
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
                    historyId={historyIdA}
                    onUpdateHistoryItem={onUpdateHistoryItem}
                    t={t}
                />
                {/* Output B */}
                <OutputDisplay
                    output={outputB}
                    isLoading={isLoading}
                    prompt={promptB}
                    historyId={historyIdB}
                    onUpdateHistoryItem={onUpdateHistoryItem}
                    t={t}
                />
            </div>
        </div>
    );
};

export default ComparisonEditor;

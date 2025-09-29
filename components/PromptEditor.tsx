// FIX: Implemented the PromptEditor component, providing the main UI for the editor page.
import React, { useState } from 'react';
import TemplateBuilder from './TemplateBuilder';
import OutputDisplay from './OutputDisplay';
import SavedPrompts from './SavedPrompts';
import History from './History';
import { SparklesIcon } from './icons';
import { HistoryItem, Prompt } from '../types';

interface PromptEditorProps {
    onRefine: (prompt: string) => Promise<{ refinedPrompt: string; alignmentNotes: string | null; topics: string[] }>;
    onSavePrompt: (prompt: Prompt) => void;
    onDeletePrompt: (id: string) => void;
    onDeleteHistory: (id: string) => void;
    savedPrompts: Prompt[];
    history: HistoryItem[];
    t: (key: string) => string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
    onRefine,
    onSavePrompt,
    onDeletePrompt,
    onDeleteHistory,
    savedPrompts,
    history,
    t,
}) => {
    const [prompt, setPrompt] = useState('');
    const [variables, setVariables] = useState<string[]>([]);
    const [refinedPrompt, setRefinedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buildPrompt = () => {
        let finalPrompt = prompt;
        variables.forEach(v => {
            finalPrompt = finalPrompt.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), `[${v.toUpperCase()}]`);
        });
        return finalPrompt;
    };

    const handleRefine = async () => {
        const promptToRefine = buildPrompt();
        if (!promptToRefine) return;

        setIsLoading(true);
        setError(null);
        setRefinedPrompt('');
        try {
            const result = await onRefine(promptToRefine);
            setRefinedPrompt(result.refinedPrompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        const name = prompt.split(' ').slice(0, 5).join(' ') + '...';
        onSavePrompt({ id: Date.now().toString(), name, text: refinedPrompt });
    };

    const handleSelectPrompt = (promptText: string) => {
        setPrompt(promptText);
        setRefinedPrompt(''); // Clear output when a new prompt is selected
    };
    
    const handleSelectHistory = (prompt: string, response: string) => {
        setPrompt(prompt);
        setRefinedPrompt(response);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('prompt_placeholder')}
                        className="w-full h-48 p-4 bg-gray-900/50 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-200"
                    />
                    <TemplateBuilder variables={variables} onVariablesChange={setVariables} t={t} />
                     <button
                        onClick={handleRefine}
                        disabled={isLoading || !prompt}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        {isLoading ? t('refining') : t('refine_prompt')}
                    </button>
                </div>
                <div className="space-y-6">
                    <OutputDisplay
                        refinedPrompt={refinedPrompt}
                        isLoading={isLoading}
                        error={error}
                        onSave={handleSave}
                        t={t}
                    />
                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <SavedPrompts
                            prompts={savedPrompts}
                            onSelectPrompt={handleSelectPrompt}
                            onDeletePrompt={onDeletePrompt}
                            t={t}
                        />
                        <History
                            history={history}
                            onSelectHistory={handleSelectHistory}
                            onDeleteHistory={onDeleteHistory}
                            t={t}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptEditor;

// FIX: Implemented conditional rendering for the Template Builder and the RAG file selector UI.
import React, { useState, useRef } from 'react';
import TemplateBuilder from './TemplateBuilder'; 
import OutputDisplay from './OutputDisplay';
import SavedPrompts from './SavedPrompts';
import History from './History';
import { SparklesIcon, PlusIcon, TrashIcon, CheckIcon } from './icons';
import { HistoryItem, Prompt, TemplateFields, Mode, TargetModel } from '../types';
import { RefinedPromptResponse } from '../services/geminiService';

interface PromptEditorProps {
    onRefine: () => Promise<RefinedPromptResponse>;
    onSavePrompt: (promptText: string) => void;
    onDeletePrompt: (id: string) => void;
    onDeleteHistory: (id: string) => void;
    savedPrompts: Prompt[];
    history: HistoryItem[];
    t: (key: string, params?: Record<string, string>) => string;
    mode: Mode;
    setMode: (mode: Mode) => void;
    targetModel: TargetModel;
    setTargetModel: (model: TargetModel) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    templateFields: TemplateFields;
    setTemplateFields: (fields: TemplateFields) => void;
    uploadedFile: File | null;
    onSetFile: (file: File | null) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = (props) => {
    const { 
        onRefine, onSavePrompt, onDeletePrompt, onDeleteHistory, savedPrompts, history, t,
        mode, setMode, targetModel, setTargetModel, prompt, setPrompt, 
        templateFields, setTemplateFields, uploadedFile, onSetFile 
    } = props;
    
    const [refinedPrompt, setRefinedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRefine = async () => {
        setIsLoading(true);
        setError(null);
        setRefinedPrompt('');
        try {
            const result = await onRefine();
            setRefinedPrompt(result.refinedPrompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    // FIX: Corrected the signature of handleSelectHistory to match the onSelectHistory prop of the History component.
    // It now accepts 'prompt' and 'response' as separate string arguments instead of a single HistoryItem object.
    const handleSelectHistory = (prompt: string, response: string) => {
        if (mode === 'quick') setPrompt(prompt);
        // In a more advanced version, we could parse the prompt back into fields for deep mode
        setRefinedPrompt(response);
    };

    const isRefineDisabled = () => {
        if (isLoading) return true;
        if (mode === 'deep' && (!templateFields.task.trim() || !templateFields.role.trim())) return true;
        if (mode === 'quick' && !prompt.trim() && !uploadedFile) return true;
        return false;
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        <ModeToggle mode={mode} setMode={setMode} t={t} />
                        <TargetModelSelector targetModel={targetModel} setTargetModel={setTargetModel} t={t} />
                    </div>

                    {mode === 'quick' ? (
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('prompt_placeholder')}
                            className="w-full h-48 p-4 bg-gray-900/50 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-200"
                        />
                    ) : (
                        <TemplateBuilder
                            fields={templateFields}
                            onFieldChange={setTemplateFields}
                            t={t}
                        >
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('prompt_placeholder')}
                                className="w-full h-24 p-4 bg-gray-900/50 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-200"
                            />
                        </TemplateBuilder>
                    )}
                    
                    <FileUploadComponent uploadedFile={uploadedFile} onSetFile={onSetFile} t={t} />

                    <button
                        onClick={handleRefine}
                        disabled={isRefineDisabled()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        {isLoading ? t('refining') : t('refine_prompt')}
                    </button>
                </div>
                <div className="space-y-6">
                    <OutputDisplay refinedPrompt={refinedPrompt} isLoading={isLoading} error={error} onSave={() => onSavePrompt(refinedPrompt)} t={t} />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <SavedPrompts prompts={savedPrompts} onSelectPrompt={setRefinedPrompt} t={t} onDeletePrompt={onDeletePrompt} />
                        <History history={history} onSelectHistory={handleSelectHistory} t={t} onDeleteHistory={onDeleteHistory} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModeToggle: React.FC<{ mode: Mode, setMode: (mode: Mode) => void, t: (key: string) => string }> = ({ mode, setMode, t }) => (
    <div className="flex bg-gray-800/50 p-1 rounded-lg">
        <button onClick={() => setMode('quick')} className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'quick' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{t('quick_mode')}</button>
        <button onClick={() => setMode('deep')} className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'deep' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{t('deep_mode')}</button>
    </div>
);

const TargetModelSelector: React.FC<{ targetModel: TargetModel, setTargetModel: (model: TargetModel) => void, t: (key: string) => string }> = ({ targetModel, setTargetModel, t }) => (
    <div className="flex items-center bg-gray-800/50 p-1 rounded-lg">
        <label className="text-sm text-gray-400 px-2">{t('target_model_label')}</label>
        <select
            value={targetModel}
            onChange={(e) => setTargetModel(e.target.value as TargetModel)}
            className="bg-gray-700 border-gray-600 text-white text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
            <option value="Generic-LLM">{t('model_generic')}</option>
            <option value="Gemini-Ultra">{t('model_gemini_ultra')}</option>
            <option value="Code-Interpreter">{t('model_code_interpreter')}</option>
            <option value="Imagen">{t('model_imagen')}</option>
        </select>
    </div>
);

const FileUploadComponent: React.FC<{ uploadedFile: File | null; onSetFile: (file: File | null) => void; t: (key: string, params?: Record<string, string>) => string; }> = ({ uploadedFile, onSetFile, t }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => onSetFile(e.target.files ? e.target.files[0] : null);

    return (
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt,.md,.png,.jpg,.jpeg" className="hidden" />
            {uploadedFile ? (
                <div className="flex items-center gap-2 text-sm text-cyan-300">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="truncate" title={uploadedFile.name}>{t('file_attached', { fileName: uploadedFile.name })}</span>
                    <button onClick={() => onSetFile(null)} className="ml-auto text-red-400 hover:text-red-300" title={t('remove_file_title')}>
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-indigo-700/50 text-indigo-300 hover:bg-indigo-600/50"
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('attach_file')}
                </button>
            )}
        </div>
    );
};

export default PromptEditor;
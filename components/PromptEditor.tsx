// components/PromptEditor.tsx
import React from 'react';
import { Mode, Prompt, HistoryItem, TargetModel } from '../types';
import { WandIcon } from './icons';
import SavedPrompts from './SavedPrompts';
import History from './History';

interface PromptEditorProps {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  targetModel: TargetModel;
  setTargetModel: (model: TargetModel) => void;
  onRefine: () => void;
  isLoading: boolean;
  t: (key: string) => string;
  savedPrompts: Prompt[];
  onSelectPrompt: (promptText: string) => void;
  onDeletePrompt: (id: string) => void;
  history: HistoryItem[];
  onSelectHistory: (prompt: string, response: string) => void;
  onDeleteHistory: (id: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  userPrompt,
  setUserPrompt,
  mode,
  setMode,
  targetModel,
  setTargetModel,
  onRefine,
  isLoading,
  t,
  savedPrompts,
  onSelectPrompt,
  onDeletePrompt,
  history,
  onSelectHistory,
  onDeleteHistory,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder={t('user_prompt_placeholder')}
            className="w-full h-48 p-4 bg-gray-800/50 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-200 resize-none"
            disabled={isLoading}
          />
          <p className="text-right text-sm text-gray-500 mt-1">
            {userPrompt.length} / 5000
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <ModeToggle mode={mode} setMode={setMode} t={t} />
            <TargetModelSelector
              targetModel={targetModel}
              setTargetModel={setTargetModel}
              t={t}
            />
          </div>
          <button
            onClick={onRefine}
            disabled={isLoading || !userPrompt.trim()}
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            <WandIcon className="w-5 h-5" />
            {isLoading ? t('refining') : t('refine_prompt_btn')}
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <SavedPrompts
          prompts={savedPrompts}
          onSelectPrompt={onSelectPrompt}
          onDeletePrompt={onDeletePrompt}
          t={t}
        />
        <History
          history={history}
          onSelectHistory={onSelectHistory}
          onDeleteHistory={onDeleteHistory}
          t={t}
        />
      </div>
    </div>
  );
};

interface ModeToggleProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  t: (key: string) => string;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode, t }) => {
    return (
        <div className="flex items-center bg-gray-800/60 rounded-full p-1">
            <button
                onClick={() => setMode('quick')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${mode === 'quick' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                title={t('mode_quick_desc')}
            >
                {t('mode_quick')}
            </button>
            <button
                onClick={() => setMode('deep')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${mode === 'deep' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                title={t('mode_deep_desc')}
            >
                {t('mode_deep')}
            </button>
        </div>
    );
};

interface TargetModelSelectorProps {
  targetModel: TargetModel;
  setTargetModel: (model: TargetModel) => void;
  t: (key: string) => string;
}

const TargetModelSelector: React.FC<TargetModelSelectorProps> = ({ targetModel, setTargetModel, t }) => {
  const models: TargetModel[] = ['Generic-LLM', 'Gemini-Ultra', 'Code-Interpreter', 'Imagen'];

  const modelTranslations: Record<TargetModel, string> = {
    'Generic-LLM': t('model_generic'),
    'Gemini-Ultra': t('model_gemini_ultra'),
    'Code-Interpreter': t('model_code_interpreter'),
    'Imagen': t('model_imagen'),
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="target-model" className="text-sm font-medium text-gray-400">{t('target_model_label')}</label>
      <select
        id="target-model"
        value={targetModel}
        onChange={(e) => setTargetModel(e.target.value as TargetModel)}
        className="bg-gray-800/60 border border-gray-700 text-white text-sm rounded-full focus:ring-indigo-500 focus:border-indigo-500 block p-2"
      >
        {models.map(model => (
          <option key={model} value={model}>
            {modelTranslations[model]}
          </option>
        ))}
      </select>
    </div>
  );
};


export default PromptEditor;

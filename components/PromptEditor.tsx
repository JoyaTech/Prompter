import React, { useState, useEffect } from 'react';
import { WandIcon, SaveIcon, CheckIcon } from './icons';
import { AppState } from '../types';

interface PromptEditorProps {
  onPromptSubmit: (prompt: string) => void;
  onSavePrompt: (name: string, text: string) => void;
  appState: AppState;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ onPromptSubmit, onSavePrompt, appState }) => {
  const [prompt, setPrompt] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const isLoading = appState === AppState.LOADING || appState === AppState.STREAMING;

  useEffect(() => {
    // A simple approximation: 1 token ~ 4 characters
    const count = prompt.trim() ? Math.ceil(prompt.length / 4) : 0;
    setTokenCount(count);
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt);
    }
  };

  const handleSave = () => {
    if(prompt.trim()) {
      const name = prompt.split(' ').slice(0, 5).join(' ') + (prompt.split(' ').length > 5 ? '...' : '');
      onSavePrompt(name, prompt);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here... e.g., 'A cat on a skateboard'"
          className="w-full h-40 p-4 pr-24 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition-colors"
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {isSaved && (
              <span className="text-sm text-green-400 flex items-center gap-1">
                <CheckIcon className="w-4 h-4" />
                Prompt Saved!
              </span>
            )}
            <button
                type="button"
                onClick={handleSave}
                className="p-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Save Prompt"
                disabled={isLoading || !prompt.trim()}
            >
                <SaveIcon className="w-5 h-5" />
            </button>
            <button
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait transition-colors"
                title="Perfect Prompt"
                disabled={isLoading}
            >
                <WandIcon className="w-5 h-5" />
            </button>
        </div>
      </form>
      <div className="text-right text-xs text-gray-500 pr-1">
        Estimated Tokens: {tokenCount}
      </div>
    </div>
  );
};

export default PromptEditor;
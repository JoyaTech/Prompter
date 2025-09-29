import React from 'react';
import { WandIcon } from './icons';

interface PromptEditorProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: 'quick' | 'deep';
  setMode: (mode: 'quick' | 'deep') => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ onSubmit, isLoading, prompt, setPrompt, mode, setMode }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  const estimatedTokens = Math.ceil(prompt.length / 4);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your initial prompt idea here..."
          className="w-full h-32 p-4 pr-12 bg-gray-800/50 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors text-gray-200 resize-none"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
            {prompt.trim().length > 0 && `Est. Tokens: ${estimatedTokens}`}
        </p>

        <div className="flex items-center gap-4">
            <div className="flex rounded-md bg-gray-700 p-0.5">
                <button
                    type="button"
                    onClick={() => setMode('quick')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${mode === 'quick' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                    Quick
                </button>
                <button
                    type="button"
                    onClick={() => setMode('deep')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${mode === 'deep' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                    Deep
                </button>
            </div>
        
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <WandIcon className="w-5 h-5" />
              {isLoading ? 'Refining...' : 'Refine Prompt'}
            </button>
        </div>
      </div>
    </form>
  );
};

export default PromptEditor;
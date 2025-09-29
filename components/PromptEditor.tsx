import React from 'react';
import { Status } from '../types';
import CopyButton from './CopyButton';
import { SaveIcon } from './icons';

interface PromptEditorProps {
  originalPrompt: string;
  setOriginalPrompt: (prompt: string) => void;
  improvedPrompt: string;
  status: Status;
  error: string | null;
  handleSubmit: () => void;
  handleSave: () => void;
  handleReset: () => void;
}

export default function PromptEditor({
  originalPrompt,
  setOriginalPrompt,
  improvedPrompt,
  status,
  error,
  handleSubmit,
  handleSave,
  handleReset,
}: PromptEditorProps): React.ReactElement {
  const isLoading = status === Status.LOADING;
  const isSuccess = status === Status.SUCCESS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Original Prompt Section */}
      <div className="flex flex-col gap-4">
        <label htmlFor="original-prompt" className="text-xl font-semibold text-gray-200">
          Your Prompt
        </label>
        <textarea
          id="original-prompt"
          value={originalPrompt}
          onChange={(e) => setOriginalPrompt(e.target.value)}
          placeholder="e.g., Write a short story about a robot who discovers music."
          className="flex-grow p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors text-gray-300 resize-none min-h-[200px]"
          disabled={isLoading}
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!originalPrompt.trim() || isLoading}
            className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Improving...' : 'Improve Prompt'}
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading && !isSuccess}
            className="px-6 py-3 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Improved Prompt Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-200">Improved Prompt</h2>
          {isSuccess && improvedPrompt && (
            <div className="flex gap-2">
                <CopyButton textToCopy={improvedPrompt} />
                <button 
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  <SaveIcon className="w-4 h-4" />
                  Save
                </button>
            </div>
          )}
        </div>
        <div className="relative flex-grow">
          <textarea
            id="improved-prompt"
            value={improvedPrompt}
            readOnly
            placeholder="The improved prompt will appear here..."
            className="w-full h-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 resize-none min-h-[200px]"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
                <div className="w-8 h-8 border-4 border-t-indigo-500 border-gray-700 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
}

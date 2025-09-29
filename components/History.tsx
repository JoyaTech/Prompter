import React from 'react';
import { SavedPrompt } from '../types';
import { HistoryIcon, TrashIcon } from './icons';

interface HistoryProps {
  prompts: SavedPrompt[];
  onUse: (prompt: SavedPrompt) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

function History({ prompts, onUse, onDelete, onClear }: HistoryProps): React.ReactElement {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
            <HistoryIcon className="w-7 h-7 text-indigo-400"/>
            <h2 className="text-3xl font-bold text-gray-200">History</h2>
        </div>
        {prompts.length > 0 && (
            <button
                onClick={onClear}
                className="bg-red-900/50 text-red-400 px-3 py-1.5 rounded-md text-sm hover:bg-red-900/80 transition-colors flex items-center gap-2"
            >
                <TrashIcon className="w-4 h-4"/>
                Clear History
            </button>
        )}
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-gray-500">Your prompt history is empty.</p>
          <p className="text-gray-500 text-sm">Improve a prompt to start your history.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs mb-1">Original</p>
                <p className="text-gray-300 truncate text-sm">{prompt.original}</p>
                 <p className="text-gray-400 text-xs mt-2 mb-1">Improved</p>
                <p className="text-gray-200 truncate font-medium text-sm">{prompt.improved}</p>
              </div>
              <div className="flex items-center flex-shrink-0 gap-2">
                <button
                  onClick={() => onUse(prompt)}
                  className="bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-600 transition-colors"
                >
                  Use
                </button>
                <button
                  onClick={() => onDelete(prompt.id)}
                  aria-label="Delete from history"
                  className="bg-red-900/50 text-red-400 p-2 rounded-md hover:bg-red-900/80 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;

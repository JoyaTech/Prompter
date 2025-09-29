import React from 'react';
import { SavedPrompt } from '../types';
import { BookmarkIcon, TrashIcon } from './icons';

interface SavedPromptsProps {
  prompts: SavedPrompt[];
  onUse: (prompt: SavedPrompt) => void;
  onDelete: (id: string) => void;
}

function SavedPrompts({ prompts, onUse, onDelete }: SavedPromptsProps): React.ReactElement {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <BookmarkIcon className="w-7 h-7 text-indigo-400"/>
        <h2 className="text-3xl font-bold text-gray-200">Saved Prompts</h2>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-gray-500">You haven't saved any prompts yet.</p>
          <p className="text-gray-500 text-sm">Improved prompts can be saved for later use.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1 font-semibold tracking-wider uppercase">Original</p>
                  <p className="text-gray-300 bg-gray-900/50 p-2 rounded text-sm break-words">{prompt.original}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold tracking-wider uppercase">Improved</p>
                  <p className="text-gray-200 bg-gray-900/50 p-2 rounded text-sm font-medium break-words">{prompt.improved}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => onUse(prompt)}
                  className="bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-600 transition-colors"
                >
                  Use
                </button>
                <button
                  onClick={() => onDelete(prompt.id)}
                  aria-label="Delete prompt"
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

export default SavedPrompts;

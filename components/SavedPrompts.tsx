import React from 'react';
import { Prompt } from '../types';
import { TrashIcon } from './icons';

interface SavedPromptsProps {
  prompts: Prompt[];
  onSelectPrompt: (promptText: string) => void;
  onDeletePrompt: (id: string) => void;
  t: (key: string) => string;
}

const SavedPrompts: React.FC<SavedPromptsProps> = ({ prompts, onSelectPrompt, onDeletePrompt, t }) => {
  if (prompts.length === 0) {
    return null; // Don't render anything if there are no saved prompts
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-300">{t('saved_prompts')}</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {prompts.map((prompt) => (
            <li
              key={prompt.id}
              className="group bg-gray-800/50 p-3 rounded-md flex justify-between items-center transition-colors hover:bg-gray-700/70"
            >
              <button
                onClick={() => onSelectPrompt(prompt.text)}
                className="text-left flex-grow overflow-hidden"
              >
                <p className="text-gray-300 truncate" title={prompt.text}>{prompt.name}</p>
              </button>
              <button
                onClick={() => onDeletePrompt(prompt.id)}
                className="ml-4 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete prompt"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SavedPrompts;

import React, { useState } from 'react';
import CopyButton from './CopyButton';
import { SaveIcon, CheckIcon } from './icons';

interface OutputDisplayProps {
  refinedPrompt: string;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ refinedPrompt, isLoading, error, onSave }) => {
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const hasContent = refinedPrompt.length > 0;

  const handleSave = () => {
    onSave();
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 2000);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
          <p className="ml-3 text-gray-400">Perfecting your prompt...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-400 text-center">{error}</p>;
    }
    if (hasContent) {
      return <p className="whitespace-pre-wrap">{refinedPrompt}</p>;
    }
    return (
      <p className="text-gray-500 text-center">
        Your refined prompt will appear here once generated.
      </p>
    );
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 min-h-[150px] flex flex-col justify-between">
      <div className="flex-grow text-gray-200">
        {renderContent()}
      </div>
      {hasContent && !isLoading && !error && (
        <div className="flex justify-between items-center mt-4">
           <p className="text-xs text-gray-500">
             Est. Tokens: {Math.ceil(refinedPrompt.length / 4)}
           </p>
          <div className="flex items-center gap-3">
            {showSaveConfirmation && (
              <span className="text-sm text-green-400 flex items-center gap-1">
                <CheckIcon className="w-4 h-4" />
                Prompt Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors duration-200 bg-indigo-600/30 text-indigo-300 hover:bg-indigo-500/40"
            >
                <SaveIcon className="w-4 h-4" />
                Save
            </button>
            <CopyButton textToCopy={refinedPrompt} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputDisplay;
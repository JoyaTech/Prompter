import React from 'react';
import CopyButton from './CopyButton';
import { AppState } from '../types';
import { LoaderIcon } from './icons';

interface OutputDisplayProps {
  output: string;
  appState: AppState;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, appState, error }) => {
  const isLoading = appState === AppState.LOADING || appState === AppState.STREAMING;
  const tokenCount = output.trim() ? Math.ceil(output.length / 4) : 0;

  const renderContent = () => {
    if (appState === AppState.ERROR) {
      return <p className="text-red-400">{error || 'An unexpected error occurred.'}</p>;
    }

    if (isLoading && !output) {
      return (
        <div className="flex items-center gap-3 text-gray-400">
          <LoaderIcon className="w-5 h-5 animate-spin" />
          <span>Perfecting your prompt...</span>
        </div>
      );
    }
    
    if (appState === AppState.IDLE && !output) {
        return <p className="text-gray-500">Your perfected prompt will appear here.</p>;
    }
    
    return (
        <pre className="text-gray-200 whitespace-pre-wrap font-sans">
            {output}
            {isLoading && <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse"></span>}
        </pre>
    );
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 pb-10 relative min-h-[160px] border border-gray-700">
      <div className="absolute top-3 right-3">
        {output && appState !== AppState.LOADING && <CopyButton textToCopy={output} />}
      </div>
      {renderContent()}
      {tokenCount > 0 && !isLoading && (
        <div className="absolute bottom-3 right-4 text-xs text-gray-500">
          Estimated Tokens: {tokenCount}
        </div>
      )}
    </div>
  );
};

export default OutputDisplay;
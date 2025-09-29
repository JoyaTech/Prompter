import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CopyButton from './CopyButton';
import { SparklesIcon } from './icons';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  prompt: string;
  t: (key: string) => string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, prompt, t }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-300">{t('output_title')}</h3>
        {output && !isLoading && <CopyButton textToCopy={output} />}
      </div>
      <div className="prose prose-invert prose-sm max-w-none bg-gray-900/50 rounded-md p-4 overflow-y-auto flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-gray-400">
                <SparklesIcon className="w-8 h-8 animate-pulse" />
                <span>{t('status_generating')}</span>
            </div>
          </div>
        ) : output ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
        ) : (
          <p className="text-gray-500">{t('output_placeholder')}</p>
        )}
      </div>
       {prompt && !isLoading && (
        <div className="mt-4 p-3 bg-gray-900/50 rounded-md border border-gray-700">
            <p className="text-xs text-gray-500 font-semibold mb-1">{t('prompt_used_label')}</p>
            <p className="text-xs text-gray-400 whitespace-pre-wrap font-mono">{prompt}</p>
        </div>
       )}
    </div>
  );
};

export default OutputDisplay;

import React from 'react';
import { HistoryItem } from '../types';
import { TrashIcon, ShieldCheckIcon } from './icons';

interface HistoryProps {
  history: HistoryItem[];
  onSelectHistory: (prompt: string, response: string) => void;
  onDeleteHistory: (id: string) => void;
  t: (key: string) => string;
}

const History: React.FC<HistoryProps> = ({ history, onSelectHistory, onDeleteHistory, t }) => {
  if (history.length === 0) {
    return null; // Don't render anything if history is empty
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-300">{t('history')}</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {history.map((item) => (
            <li
              key={item.id}
              className="group bg-gray-800/50 p-3 rounded-md flex justify-between items-center transition-colors hover:bg-gray-700/70"
            >
              <button
                onClick={() => onSelectHistory(item.prompt, item.response)}
                className="text-left flex-grow overflow-hidden flex items-center gap-2"
              >
                {item.alignment_notes && (
                  // FIX: Moved the title prop from the ShieldCheckIcon component to its parent div to fix a type error.
                  // The 'title' attribute is valid on a div and provides the intended tooltip.
                  <div className="relative" title={t('alignment_notes_title')}>
                    <ShieldCheckIcon 
                      className="w-5 h-5 text-cyan-400 shrink-0"
                    />
                     <div className="absolute bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-700 shadow-lg z-10">
                        {item.alignment_notes}
                    </div>
                  </div>
                )}
                <div className="flex-grow overflow-hidden">
                    <p className="text-gray-300 truncate" title={item.prompt}>{item.prompt}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.timestamp.toLocaleTimeString()}
                    </p>
                </div>
              </button>
              <button
                onClick={() => onDeleteHistory(item.id)}
                className="ml-4 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete history item"
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

export default History;

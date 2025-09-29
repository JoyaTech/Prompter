
import React from 'react';
import { HistoryItem } from '../types';
import { TrashIcon, ShieldCheckIcon, StarIcon } from './icons';

interface HistoryProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
  t: (key: string) => string;
}

const History: React.FC<HistoryProps> = ({ history, onSelectHistory, onDeleteHistory, t }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-text-secondary">{t('history')}</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {history.map((item) => (
            <li
              key={item.id}
              className="group bg-card-secondary p-3 rounded-md flex justify-between items-center transition-colors hover:bg-border-color"
            >
              <button
                onClick={() => onSelectHistory(item)}
                className="text-left flex-grow overflow-hidden flex items-start gap-2"
              >
                <div className="flex flex-col items-center gap-1 pt-0.5">
                    {item.alignment_notes && (
                      <div className="relative" title={`${t('alignment_notes_title')}: ${item.alignment_notes}`}>
                        <ShieldCheckIcon className="w-5 h-5 text-accent shrink-0" />
                      </div>
                    )}
                    {item.rating && (
                         <div className="flex items-center text-yellow-400" title={`Rated: ${item.rating}/5`}>
                            <StarIcon className="w-4 h-4" />
                            <span className="text-xs font-bold ml-0.5">{item.rating}</span>
                         </div>
                    )}
                </div>
                <div className="flex-grow overflow-hidden">
                    <p className="text-text-main truncate" title={item.prompt}>{item.prompt}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      {item.timestamp.toLocaleTimeString()}
                    </p>
                </div>
              </button>
              <button
                onClick={() => onDeleteHistory(item.id)}
                className="ml-4 p-1 text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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

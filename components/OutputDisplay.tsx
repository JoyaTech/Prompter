import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CopyButton from './CopyButton';
import { SparklesIcon, StarIcon } from './icons';
import { HistoryItem } from '../types';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  prompt: string;
  historyItem: HistoryItem | null;
  onUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
  onDeclareWinner?: (promptText: string) => void;
  competingRating?: number;
  t: (key: string) => string;
}

const FeedbackCollector: React.FC<{ historyId: string; onUpdateHistoryItem: OutputDisplayProps['onUpdateHistoryItem'], t: (key: string) => string }> = ({ historyId, onUpdateHistoryItem, t }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSaveFeedback = () => {
        if (!historyId) return;
        onUpdateHistoryItem(historyId, { rating, feedback });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
    };

    if (submitted) {
        return <p className="text-sm text-green-400">{t('feedback_thanks')}</p>;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">{t('feedback_rating_label')}</span>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)}>
                            <StarIcon className={`w-5 h-5 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-600'}`} />
                        </button>
                    ))}
                </div>
            </div>
            <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder={t('feedback_notes_placeholder')}
                className="w-full h-16 p-2 text-sm bg-card-secondary border border-border-color rounded-md resize-none focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button onClick={handleSaveFeedback} disabled={rating === 0} className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-md disabled:bg-primary/50 disabled:cursor-not-allowed">
                {t('feedback_save_button')}
            </button>
        </div>
    );
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, prompt, historyItem, onUpdateHistoryItem, onDeclareWinner, competingRating, t }) => {
  const showHigherRatedBadge = 
    historyItem?.rating &&
    typeof competingRating === 'number' &&
    historyItem.rating >= competingRating + 2;

  return (
    <div className="bg-card p-4 rounded-lg border border-border-color flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-text-main">{t('output_title')}</h3>
          {showHigherRatedBadge && (
            <span className="px-2 py-0.5 text-xs font-bold text-green-300 bg-green-800/50 rounded-full">
              {t('comparison_higher_rated')}
            </span>
          )}
        </div>
        {output && !isLoading && <CopyButton textToCopy={output} />}
      </div>
      <div className="prose prose-invert prose-sm max-w-none bg-background rounded-md p-4 overflow-y-auto flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-text-secondary">
                <SparklesIcon className="w-8 h-8 animate-pulse text-primary" />
                <span>{t('status_generating')}</span>
            </div>
          </div>
        ) : output ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
        ) : (
          <p className="text-text-secondary">{t('output_placeholder')}</p>
        )}
      </div>
       {prompt && !isLoading && (
        <div className="mt-4 p-3 bg-background rounded-md border border-border-color">
            <div className="flex justify-between items-center">
              <p className="text-xs text-text-secondary font-semibold mb-1">{t('prompt_used_label')}</p>
              {onDeclareWinner && (
                <button onClick={() => onDeclareWinner(prompt)} className="px-3 py-1 text-xs font-semibold bg-accent/80 text-background rounded-md hover:bg-accent transition-colors">
                  🏆 {t('comparison_declare_winner')}
                </button>
              )}
            </div>
            <p className="text-xs text-text-secondary whitespace-pre-wrap font-mono mt-1">{prompt}</p>
        </div>
       )}
       {output && !isLoading && historyItem && (
        <div className="mt-4 pt-4 border-t border-border-color">
            <FeedbackCollector historyId={historyItem.id} onUpdateHistoryItem={onUpdateHistoryItem} t={t} />
        </div>
       )}
    </div>
  );
};

export default OutputDisplay;
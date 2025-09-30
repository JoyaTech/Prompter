import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheckIcon } from './icons';
import { analyzeAlignment } from '../services/geminiService';

interface AlignmentAnalysisProps {
  prompt: string;
  responseText: string;
  onAnalysisComplete: (notes: string) => void;
}

const AlignmentAnalysis: React.FC<AlignmentAnalysisProps> = ({ prompt, responseText, onAnalysisComplete }) => {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt || !responseText) return;
    setIsLoading(true);
    try {
      const result = await analyzeAlignment(prompt, responseText);
      setAnalysis(result);
      onAnalysisComplete(result);
    } catch (error) {
      console.error("Alignment analysis failed:", error);
      setAnalysis("Error during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border-color mt-4">
      <div className="flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold text-text-main">{t('alignment_title')}</h3>
            <p className="text-sm text-text-secondary">{t('alignment_desc')}</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !prompt || !responseText}
          className="px-4 py-2 bg-accent/80 text-background font-semibold rounded-lg shadow-md hover:bg-accent disabled:bg-accent/40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <ShieldCheckIcon className="w-5 h-5"/>
          {isLoading ? t('alignment_analyzing') : t('alignment_analyze')}
        </button>
      </div>
      {analysis && (
        <div className="mt-4 p-3 bg-background rounded-md">
          <p className="text-sm text-text-main whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default AlignmentAnalysis;

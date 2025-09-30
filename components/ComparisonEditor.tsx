
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryItem } from '../types';

interface ComparisonEditorProps {
    onAddHistory: (prompt: string, response: string, alignmentNotes?: string) => HistoryItem;
    onUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
}

const ComparisonEditor: React.FC<ComparisonEditorProps> = ({ onAddHistory, onUpdateHistoryItem }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full">
            <h3 className="text-lg font-semibold text-text-main mb-4">{t('button_ab_test')}</h3>
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border-color rounded-md">
                <p className="text-text-secondary">A/B Comparison editor will be here.</p>
            </div>
        </div>
    );
};

export default ComparisonEditor;

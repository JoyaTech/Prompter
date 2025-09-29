import React from 'react';

interface AlchemistWorkbenchProps {
    t: (key: string) => string;
}

const AlchemistWorkbench: React.FC<AlchemistWorkbenchProps> = ({ t }) => {
    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full">
            <h3 className="text-lg font-semibold text-text-main mb-4">{t('alchemist_workbench_title')}</h3>
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border-color rounded-md">
                <p className="text-text-secondary">Drag prompts here to combine them.</p>
            </div>
        </div>
    );
};

export default AlchemistWorkbench;

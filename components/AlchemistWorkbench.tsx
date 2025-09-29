import React from 'react';

interface AlchemistWorkbenchProps {
    t: (key: string) => string;
}

const AlchemistWorkbench: React.FC<AlchemistWorkbenchProps> = ({ t }) => {
    return (
        <div className="bg-card p-6 rounded-lg border border-border-color h-full">
            <h3 className="text-lg font-semibold text-text-main mb-4">{t('alchemist_workbench_title')}</h3>
            <div className="text-center text-text-secondary py-12">
                 <p>(Feature coming soon)</p>
            </div>
        </div>
    );
};

export default AlchemistWorkbench;

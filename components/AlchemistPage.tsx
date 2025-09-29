import React from 'react';
import AlchemistLibrary from './AlchemistLibrary';
import AlchemistWorkbench from './AlchemistWorkbench';

interface AlchemistPageProps {
    t: (key: string) => string;
}

const AlchemistPage: React.FC<AlchemistPageProps> = ({ t }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text-main">{t('alchemist_title')}</h2>
                <p className="mt-1 text-text-secondary">{t('alchemist_desc')}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <AlchemistLibrary t={t} />
                </div>
                <div className="lg:col-span-2">
                    <AlchemistWorkbench t={t} />
                </div>
            </div>
        </div>
    );
};

export default AlchemistPage;

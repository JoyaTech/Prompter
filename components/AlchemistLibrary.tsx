import React from 'react';

interface AlchemistLibraryProps {
    t: (key: string) => string;
}

const AlchemistLibrary: React.FC<AlchemistLibraryProps> = ({ t }) => {
    return (
        <div className="bg-card p-6 rounded-lg border border-border-color h-full">
            <h3 className="text-lg font-semibold text-text-main mb-4">{t('alchemist_library_title')}</h3>
            <div className="text-center text-text-secondary py-12">
                <p>(Feature coming soon)</p>
            </div>
        </div>
    );
};

export default AlchemistLibrary;

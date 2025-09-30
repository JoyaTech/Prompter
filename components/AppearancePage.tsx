// FIX: Implemented the AppearancePage component.
import React from 'react';
import { useTranslation } from 'react-i18next';
import ThemeCustomizer from './ThemeCustomizer';

const AppearancePage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text-main">{t('appearance_title')}</h2>
                <p className="mt-1 text-text-secondary">{t('appearance_desc')}</p>
            </div>
            <ThemeCustomizer />
        </div>
    );
};

export default AppearancePage;

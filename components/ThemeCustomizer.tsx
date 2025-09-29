import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { Theme } from '../types';

const ThemeCustomizer: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();

    const handleColorChange = (key: keyof Theme, value: string) => {
        setTheme({ ...theme, [key]: value });
    };

    const colorFields: { key: keyof Theme; labelKey: string }[] = [
        { key: 'primary', labelKey: 'theme_primary_color' },
        { key: 'accent', labelKey: 'theme_accent_color' },
        { key: 'background', labelKey: 'theme_background_color' },
        { key: 'card', labelKey: 'theme_card_color' },
        { key: 'textMain', labelKey: 'theme_text_color' },
    ];

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-text-main">{t('theme_title')}</h2>
                <p className="mt-1 text-text-secondary">{t('theme_desc')}</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border-color space-y-6">
                {colorFields.map(({ key, labelKey }) => (
                    <div key={key} className="flex items-center justify-between">
                        <label htmlFor={key} className="text-text-main font-medium">
                            {t(labelKey)}
                        </label>
                        <div className="flex items-center gap-3 p-2 border border-border-color rounded-md bg-background">
                            <input
                                id={key}
                                type="color"
                                value={theme[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                                style={{'WebkitAppearance': 'none', 'MozAppearance': 'none', appearance: 'none'}}
                            />
                            <span className="font-mono text-text-secondary">{theme[key]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemeCustomizer;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeContext';
import { ThemeColors, ThemeSettings } from '../types';

const ColorInput: React.FC<{ label: string, colorKey: keyof ThemeColors }> = ({ label, colorKey }) => {
    const { theme, updateThemeColors } = useTheme();
    return (
        <div className="flex items-center justify-between">
            <label htmlFor={colorKey} className="text-sm text-text-secondary">{label}</label>
            <input
                id={colorKey}
                type="color"
                value={theme.colors[colorKey]}
                onChange={(e) => updateThemeColors({ [colorKey]: e.target.value })}
                className="w-8 h-8 p-0 border-none rounded-md bg-transparent"
            />
        </div>
    );
};

const ThemeCustomizer: React.FC = () => {
    const { t } = useTranslation();
    const { theme, availablePresets, setThemePreset, updateThemeSetting } = useTheme();

    return (
        <div className="bg-card p-6 rounded-lg border border-border-color space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-main mb-3">{t('appearance_presets')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(availablePresets).map(([key, preset]) => (
                        <button key={key} onClick={() => setThemePreset(key as any)} className={`p-2 rounded-md border-2 ${theme.name === preset.name ? 'border-primary' : 'border-transparent'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.primary }}></div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.accent }}></div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.background }}></div>
                            </div>
                            <span className="text-sm font-medium">{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-text-main mb-3">Colors</h3>
                 <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <ColorInput label="Primary" colorKey="primary" />
                    <ColorInput label="Accent" colorKey="accent" />
                    <ColorInput label="Background" colorKey="background" />
                    <ColorInput label="Card" colorKey="card" />
                    <ColorInput label="Main Text" colorKey="text-main" />
                    <ColorInput label="Secondary Text" colorKey="text-secondary" />
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-text-main mb-3">{t('appearance_density')}</h3>
                    <div className="flex items-center gap-2 bg-card-secondary p-1 rounded-md">
                        {(['compact', 'comfortable', 'spacious'] as const).map(d => (
                             <button key={d} onClick={() => updateThemeSetting('density', d)} className={`w-full py-1.5 text-sm font-semibold rounded ${theme.density === d ? 'bg-primary text-white' : 'hover:bg-border-color'}`}>
                                {t(`appearance_density_${d}`)}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text-main mb-3">{t('appearance_border_radius')}</h3>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="0"
                            max="1.5"
                            step="0.125"
                            value={theme.borderRadius}
                            onChange={(e) => updateThemeSetting('borderRadius', parseFloat(e.target.value))}
                            className="w-full h-2 bg-card-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm font-mono text-text-secondary">{theme.borderRadius}rem</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeCustomizer;

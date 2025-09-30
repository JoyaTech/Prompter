import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeCustomizer from './ThemeCustomizer';
import { useAppContext } from './AppContext';

const AppearancePage: React.FC = () => {
  const { t } = useTranslation();
  const { handleExportData, handleImportData } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        handleImportData(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-text-main">{t('appearance_title')}</h2>
        <p className="mt-1 text-text-secondary">{t('appearance_desc')}</p>
      </div>

      <ThemeCustomizer />
      
      <div>
        <h2 className="text-xl font-bold text-text-main">{t('appearance_data_management')}</h2>
        <p className="mt-1 text-text-secondary">{t('appearance_data_desc')}</p>
        <div className="mt-4 bg-card p-6 rounded-lg border border-border-color flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <button onClick={handleExportData} className="px-4 py-2 bg-card-secondary rounded-md font-semibold text-text-main hover:bg-border-color">
                    {t('appearance_data_export')}
                 </button>
                 <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-card-secondary rounded-md font-semibold text-text-main hover:bg-border-color">
                    {t('appearance_data_import')}
                 </button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    accept=".json"
                    className="hidden"
                 />
            </div>
            <p className="text-sm text-text-secondary">{t('appearance_data_import_label')}</p>
        </div>
      </div>
    </div>
  );
};

export default AppearancePage;

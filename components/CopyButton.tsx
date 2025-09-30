import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyIcon, CheckIcon } from './icons';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-card-secondary text-text-secondary rounded-md hover:bg-border-color hover:text-text-main transition-colors"
      aria-label={t('copy_button_label')}
    >
      {isCopied ? (
        <>
          <CheckIcon className="w-4 h-4 text-green-400" />
          <span>{t('copy_button_copied')}</span>
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4" />
          <span>{t('copy_button_copy')}</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;

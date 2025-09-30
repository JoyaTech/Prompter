import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyIcon, CheckIcon } from './icons';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 bg-card-secondary hover:bg-border-color text-text-secondary hover:text-text-main rounded-md text-xs font-semibold transition-colors"
      disabled={isCopied}
    >
      {isCopied ? (
        <>
          <CheckIcon className="w-4 h-4 text-green-400" />
          <span>{t('copied_button')}</span>
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4" />
          <span>{t('copy_button')}</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;

import React, { useState } from 'react';
// FIX: Corrected import path to be relative.
import { CopyIcon, CheckIcon } from './icons';

interface CopyButtonProps {
  textToCopy: string;
}

function CopyButton({ textToCopy }: CopyButtonProps): React.ReactElement {
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
      className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors duration-200 ${
        isCopied
          ? 'bg-green-600/20 text-green-400'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {isCopied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          Copied
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4" />
          Copy
        </>
      )}
    </button>
  );
}

export default CopyButton;

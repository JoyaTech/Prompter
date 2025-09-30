import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';
import { CheckIcon, InfoIcon, XIcon } from './icons';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ICONS = {
  success: <CheckIcon className="w-5 h-5 text-green-400" />,
  error: <XIcon className="w-5 h-5 text-red-400" />,
  info: <InfoIcon className="w-5 h-5 text-blue-400" />,
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);
  
  const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
  }

  const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-text-main bg-card-secondary rounded-lg shadow-lg border border-border-color transition-all duration-300";
  const animationClasses = isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0";

  return (
    <div className={`${baseClasses} ${animationClasses}`}>
      <div className="flex-shrink-0">{ICONS[toast.type]}</div>
      <div className="text-sm font-normal flex-grow">{toast.message}</div>
      <button
        onClick={handleDismiss}
        className="-mx-1.5 -my-1.5 p-1.5 inline-flex items-center justify-center h-8 w-8 text-text-secondary hover:text-text-main hover:bg-border-color rounded-lg focus:ring-2 focus:ring-gray-300"
        aria-label="Close"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

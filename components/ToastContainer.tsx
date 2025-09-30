import React from 'react';
import { useAppContext } from './AppContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { state, removeToast } = useAppContext();
  const { toasts } = state;

  return (
    <div className="fixed top-5 right-5 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;

import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onDismiss, type = 'error' }) => {
  if (!message) return null;

  const styles = {
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      icon: 'text-red-500 dark:text-red-400',
      button: 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-500 dark:text-yellow-400',
      button: 'text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300'
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      icon: 'text-green-500 dark:text-green-400',
      button: 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
    }
  };

  const currentStyle = styles[type] || styles.error;

  return (
    <div className={`flex items-center p-4 border rounded-xl shadow-sm animate-slide-up ${currentStyle.container}`}>
      <AlertCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${currentStyle.icon}`} />
      <span className="flex-grow font-medium">{message}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className={`ml-3 p-1 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 ${currentStyle.button}`}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

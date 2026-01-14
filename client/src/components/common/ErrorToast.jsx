/**
 * Error Toast Component
 * Custom error toast with retry functionality
 */

import React from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const showErrorToast = (message, onRetry = null) => {
  const ToastContent = ({ closeToast }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-2"
    >
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{message}</p>
        {onRetry && (
          <button
            onClick={() => {
              onRetry();
              closeToast();
            }}
            className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
      <button
        onClick={closeToast}
        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </motion.div>
  );

  return toast.error(<ToastContent />, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export default showErrorToast;

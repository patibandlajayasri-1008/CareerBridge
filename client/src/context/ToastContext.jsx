import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              icon: CheckCircle2,
              bg: 'bg-white border-[#168568]/30 text-[#172033]',
              iconColor: 'text-[#168568]',
            },
            error: {
              icon: AlertCircle,
              bg: 'bg-white border-[#C2414B]/30 text-[#172033]',
              iconColor: 'text-[#C2414B]',
            },
            info: {
              icon: Info,
              bg: 'bg-white border-[#3157D5]/30 text-[#172033]',
              iconColor: 'text-[#3157D5]',
            },
          }[toast.type] || {
            icon: Info,
            bg: 'bg-white border-[#E4E8F0] text-[#172033]',
            iconColor: 'text-[#3157D5]',
          };

          const Icon = typeConfig.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-3 ${typeConfig.bg}`}
              role="status"
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${typeConfig.iconColor}`} />
              <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#94A3B8] hover:text-[#172033] p-0.5 rounded transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

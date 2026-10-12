import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: 'auto',
              minWidth: '280px',
              maxWidth: '400px',
              padding: '12px 18px',
              borderRadius: '12px',
              color: '#fff',
              backgroundColor:
                toast.type === 'error' ? '#ef4444' :
                toast.type === 'warning' ? '#f59e0b' :
                toast.type === 'info' ? '#3b82f6' : '#10b981',
              boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              direction: 'rtl',
              animation: 'slideUp 0.3s ease'
            }}
          >
            <span>{toast.message}</span>
            <span style={{ fontSize: '18px', opacity: 0.8, marginRight: '10px' }}>&times;</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

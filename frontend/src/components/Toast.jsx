import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '420px',
      width: 'calc(100% - 3rem)',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={20} color="#10b981" />,
    error: <AlertCircle size={20} color="#f43f5e" />,
    info: <Info size={20} color="#06b6d4" />,
  };

  const borders = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    info: 'rgba(6, 182, 212, 0.4)',
  };

  return (
    <div
      className="animate-slide-up"
      style={{
        pointerEvents: 'auto',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${borders[toast.type] || borders.info}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem 1.1rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        color: '#f8fafc',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {icons[toast.type] || icons.info}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '2px' }}>
            {toast.title}
          </h4>
        )}
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, wordBreak: 'break-word' }}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
      >
        <X size={16} />
      </button>
    </div>
  );
}

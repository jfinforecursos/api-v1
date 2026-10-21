import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '560px' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'var(--bg-modal-backdrop)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: 'var(--shadow-lg), 0 0 50px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn-icon btn-ghost"
            style={{ borderRadius: '50%' }}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

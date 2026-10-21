import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Confirmar eliminación?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="440px">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            color: '#fb7185',
          }}
        >
          <AlertTriangle size={28} />
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
            style={{ minWidth: '110px' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
            style={{ minWidth: '120px' }}
          >
            {isLoading ? <div className="spinner" style={{ width: '16px', height: '16px' }} /> : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

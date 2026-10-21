import React, { useState } from 'react';
import {
  Activity,
  Plus,
  RefreshCw,
  Server,
  ExternalLink,
  Settings,
  Menu,
} from 'lucide-react';
import Modal from './Modal';
import { getApiBaseUrl, setApiBaseUrl } from '../api/api';

export default function Navbar({
  backendOnline,
  isCheckingHealth,
  onCheckHealth,
  onOpenAgendar,
  onToggleSidebar,
}) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customUrl, setCustomUrl] = useState(getApiBaseUrl());

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setApiBaseUrl(customUrl);
    setShowConfigModal(false);
    onCheckHealth();
  };

  const handleResetConfig = () => {
    setApiBaseUrl('');
    setCustomUrl('/api');
    setShowConfigModal(false);
    onCheckHealth();
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(8, 12, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.85rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="btn-icon btn-ghost"
            style={{ display: 'none' }}
            id="mobile-menu-trigger"
            aria-label="Abrir navegación"
          >
            <Menu size={20} />
          </button>

          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-cyan-glow)',
              }}
            >
              <Activity size={22} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                  MediCitas
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: '#22d3ee',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    letterSpacing: '0.05em',
                  }}
                >
                  PRO
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1 }}>
                Spring Boot REST + React
              </p>
            </div>
          </div>
        </div>

        {/* Status Pill & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Health indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: backendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: backendOnline ? '#10b981' : '#f43f5e',
                boxShadow: backendOnline ? '0 0 8px #10b981' : '0 0 8px #f43f5e',
                display: 'inline-block',
                animation: backendOnline ? 'pulseGlow 2s infinite' : 'none',
              }}
            />
            <span style={{ color: backendOnline ? '#34d399' : '#fb7185' }}>
              {backendOnline ? 'API Conectada (:8080)' : 'API Desconectada'}
            </span>
            <button
              onClick={onCheckHealth}
              disabled={isCheckingHealth}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                opacity: isCheckingHealth ? 0.5 : 0.8,
              }}
              title="Verificar conexión de la API"
            >
              <RefreshCw size={13} className={isCheckingHealth ? 'spinner' : ''} />
            </button>
          </div>

          {/* Quick API Config Button */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="btn-icon btn-secondary"
            title="Configurar URL del Backend"
            style={{ width: '34px', height: '34px' }}
          >
            <Settings size={16} />
          </button>

          {/* Scalar / Docs link */}
          <a
            href="http://localhost:8080/scalar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            title="Abrir documentación Scalar"
          >
            <Server size={14} />
            <span>Scalar Docs</span>
            <ExternalLink size={12} style={{ opacity: 0.6 }} />
          </a>

          {/* New Appointment Button */}
          <button onClick={onOpenAgendar} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Agendar Cita</span>
          </button>
        </div>
      </header>

      {/* Backend URL Config Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Configuración de Conexión API"
        maxWidth="480px"
      >
        <form onSubmit={handleSaveConfig}>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Por defecto el frontend se comunica con el servidor Spring Boot en <code>http://localhost:8080</code> vía proxy <code>/api</code>. Puedes personalizar la URL base aquí:
          </p>

          <div className="form-group">
            <label className="form-label">URL Base de la API</label>
            <input
              type="text"
              className="form-input"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="ej. /api o http://localhost:8080/api"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetConfig}
            >
              Restablecer (/api)
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar y Probar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

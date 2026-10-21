import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, gradient, glowColor, onClick }) {
  return (
    <div
      className={`glass-panel ${onClick ? 'card-interactive' : ''}`}
      onClick={onClick}
      style={{
        padding: '1.4rem 1.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <div style={{ zIndex: 1 }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.45rem' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          background: gradient || 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: glowColor ? `0 0 20px ${glowColor}` : '0 4px 15px rgba(0,0,0,0.3)',
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={26} strokeWidth={2.2} />}
      </div>
    </div>
  );
}

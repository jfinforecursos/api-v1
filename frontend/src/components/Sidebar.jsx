import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  UserCheck,
  Stethoscope,
  CreditCard,
  FileCode2,
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, counts = {} }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Panel General',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'citas',
      label: 'Gestión de Citas',
      icon: CalendarCheck,
      badge: counts.citas,
      badgeColor: 'rgba(6, 182, 212, 0.2)',
    },
    {
      id: 'clientes',
      label: 'Clientes / Pacientes',
      icon: Users,
      badge: counts.clientes,
    },
    {
      id: 'profesionales',
      label: 'Especialistas',
      icon: UserCheck,
      badge: counts.profesionales,
    },
    {
      id: 'servicios',
      label: 'Servicios Médicos',
      icon: Stethoscope,
      badge: counts.servicios,
    },
    {
      id: 'pagos',
      label: 'Caja y Pagos',
      icon: CreditCard,
      badge: counts.pagos,
      badgeColor: 'rgba(16, 185, 129, 0.2)',
    },
    {
      id: 'apidocs',
      label: 'OpenAPI & Scalar',
      icon: FileCode2,
      badge: 'v3',
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0c111e',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        padding: '1.5rem 1rem',
      }}
    >
      <div>
        <div style={{ padding: '0 0.5rem 1.25rem 0.5rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)' }}>
            Navegación Principal
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-cyan)' : 'transparent',
                  background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={19} color={isActive ? '#38bdf8' : '#94a3b8'} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: item.badgeColor || 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#38bdf8' : '#cbd5e1',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          Sistema de Citas v1.0
        </p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
          Arquitectura multicapa con DTOs, PostgreSQL & OpenAPI SpringDoc.
        </p>
      </div>
    </aside>
  );
}

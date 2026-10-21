import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Tag,
  X,
} from 'lucide-react';

export default function ServiciosView({
  servicios = [],
  citas = [],
  onOpenNuevoServicio,
  onEditServicio,
  onDeleteServicio,
}) {
  const [search, setSearch] = useState('');

  const filteredServicios = servicios.filter((s) => {
    const q = search.toLowerCase();
    return (
      !search ||
      s.nombre.toLowerCase().includes(q) ||
      (s.descripcion && s.descripcion.toLowerCase().includes(q))
    );
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            Catálogo de Servicios Médicos
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Administración de procedimientos, aranceles, duración estimada y tarifas
          </p>
        </div>

        <button onClick={onOpenNuevoServicio} className="btn btn-primary">
          <Plus size={16} />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            placeholder="Buscar procedimiento o servicio médico..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServicios.length === 0 ? (
        <div className="glass-panel">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Stethoscope size={28} />
            </div>
            <p style={{ fontWeight: 600, color: '#f8fafc' }}>No se encontraron servicios</p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Registra los tratamientos y procedimientos que ofrece la clínica.
            </p>
            <button onClick={onOpenNuevoServicio} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              <Plus size={14} /> Crear Primer Servicio
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredServicios.map((servicio) => {
            const citasDelServicio = citas.filter(
              (c) => c.servicio?.id === servicio.id || c.servicioId === servicio.id
            );

            return (
              <div
                key={servicio.id}
                className="glass-panel card-interactive"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
                      {servicio.nombre}
                    </h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
                      #{servicio.id}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem', minHeight: '2.5rem' }}>
                    {servicio.descripcion || 'Sin descripción detallada.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#34d399',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      ${servicio.precio ? servicio.precio.toFixed(2) : '0.00'}
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(6, 182, 212, 0.1)',
                        color: '#38bdf8',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                      }}
                    >
                      <Clock size={13} /> {servicio.duracionMinutos || 30} min
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    <strong>{citasDelServicio.length}</strong> agendamientos
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => onEditServicio(servicio)}
                      className="btn-icon btn-ghost"
                      title="Editar servicio"
                    >
                      <Edit2 size={15} color="#38bdf8" />
                    </button>
                    <button
                      onClick={() => onDeleteServicio(servicio)}
                      className="btn-icon btn-ghost"
                      title="Eliminar servicio"
                    >
                      <Trash2 size={15} color="#fb7185" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

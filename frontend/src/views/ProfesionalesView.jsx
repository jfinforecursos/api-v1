import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Award,
  Calendar,
  X,
} from 'lucide-react';

export default function ProfesionalesView({
  profesionales = [],
  citas = [],
  onOpenNuevoProfesional,
  onEditProfesional,
  onDeleteProfesional,
}) {
  const [search, setSearch] = useState('');

  const filteredProfesionales = profesionales.filter((p) => {
    const q = search.toLowerCase();
    return (
      !search ||
      p.nombre.toLowerCase().includes(q) ||
      p.especialidad.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.telefono?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            Especialistas y Profesionales de la Salud
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Directorio médico del personal facultativo para la atención de citas
          </p>
        </div>

        <button onClick={onOpenNuevoProfesional} className="btn btn-primary">
          <Plus size={16} />
          <span>Registrar Especialista</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            placeholder="Buscar especialista por nombre o especialidad médica..."
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

      {/* Grid of Specialists */}
      {filteredProfesionales.length === 0 ? (
        <div className="glass-panel">
          <div className="empty-state">
            <div className="empty-state-icon">
              <UserCheck size={28} />
            </div>
            <p style={{ fontWeight: 600, color: '#f8fafc' }}>No se encontraron especialistas</p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Registra especialistas para asignarlos a las citas de tus pacientes.
            </p>
            <button onClick={onOpenNuevoProfesional} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              <Plus size={14} /> Registrar Especialista
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
          {filteredProfesionales.map((profesional) => {
            const citasDelProfesional = citas.filter(
              (c) => c.profesional?.id === profesional.id || c.profesionalId === profesional.id
            );

            return (
              <div
                key={profesional.id}
                className="glass-panel card-interactive"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          boxShadow: 'var(--shadow-cyan-glow)',
                        }}
                      >
                        {profesional.nombre ? profesional.nombre.charAt(0).toUpperCase() : 'D'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                          {profesional.nombre}
                        </h3>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#38bdf8',
                            marginTop: '4px',
                          }}
                        >
                          <Award size={13} /> {profesional.especialidad}
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
                      #{profesional.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.75rem', padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      <Mail size={14} color="#94a3b8" />
                      <a href={`mailto:${profesional.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {profesional.email || 'Sin correo'}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      <Phone size={14} color="#94a3b8" />
                      <a href={`tel:${profesional.telefono}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {profesional.telefono || 'Sin teléfono'}
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1.25rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#06b6d4" />
                    <strong>{citasDelProfesional.length}</strong> citas asociadas
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => onEditProfesional(profesional)}
                      className="btn-icon btn-ghost"
                      title="Editar especialista"
                    >
                      <Edit2 size={15} color="#38bdf8" />
                    </button>
                    <button
                      onClick={() => onDeleteProfesional(profesional)}
                      className="btn-icon btn-ghost"
                      title="Eliminar especialista"
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

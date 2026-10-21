import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  CalendarCheck,
  Eye,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import Modal from '../components/Modal';
import { citasApi } from '../api/api';

export default function ClientesView({
  clientes = [],
  onOpenNuevoCliente,
  onEditCliente,
  onDeleteCliente,
  onOpenAgendarConCliente,
}) {
  const [search, setSearch] = useState('');
  const [viewingHistoryCliente, setViewingHistoryCliente] = useState(null);
  const [clientCitas, setClientCitas] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Filter clients
  const filteredClientes = clientes.filter((c) => {
    const q = search.toLowerCase();
    return (
      !search ||
      c.nombre.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.telefono?.toLowerCase().includes(q) ||
      c.id.toString().includes(q)
    );
  });

  const handleOpenHistory = async (cliente) => {
    setViewingHistoryCliente(cliente);
    setIsLoadingHistory(true);
    try {
      const data = await citasApi.getByCliente(cliente.id);
      setClientCitas(data || []);
    } catch (err) {
      console.error('Error fetching client citas:', err);
      setClientCitas([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            Directorio de Clientes / Pacientes
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Registro de datos de contacto y consulta de historial de citas (Relación 1 a N)
          </p>
        </div>

        <button onClick={onOpenNuevoCliente} className="btn btn-primary">
          <Plus size={16} />
          <span>Registrar Paciente</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, correo electrónico o teléfono..."
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

      {/* Patients Grid / Table */}
      <div className="glass-panel">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
            Mostrando {filteredClientes.length} de {clientes.length} pacientes registrados
          </span>
        </div>

        {filteredClientes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={28} />
            </div>
            <p style={{ fontWeight: 600, color: '#f8fafc' }}>No se encontraron pacientes</p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Registra un nuevo paciente para comenzar a agendar citas.
            </p>
            <button onClick={onOpenNuevoCliente} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              <Plus size={14} /> Registrar Paciente
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Correo Electrónico</th>
                  <th>Teléfono</th>
                  <th>Historial Clínico</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td style={{ fontWeight: 700, color: '#64748b' }}>
                      #{cliente.id}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {cliente.nombre ? cliente.nombre.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                          {cliente.nombre}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                        <Mail size={14} color="#94a3b8" />
                        <span>{cliente.email || 'No registrado'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                        <Phone size={14} color="#94a3b8" />
                        <span>{cliente.telefono || 'No registrado'}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenHistory(cliente)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        title="Ver citas de este cliente (/api/citas/cliente/{id})"
                      >
                        <CalendarCheck size={14} color="#06b6d4" />
                        <span>Ver Citas</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => onEditCliente(cliente)}
                          className="btn-icon btn-ghost"
                          title="Editar paciente"
                        >
                          <Edit2 size={15} color="#38bdf8" />
                        </button>
                        <button
                          onClick={() => onDeleteCliente(cliente)}
                          className="btn-icon btn-ghost"
                          title="Eliminar paciente"
                        >
                          <Trash2 size={15} color="#fb7185" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Appointment History Modal (GET /api/citas/cliente/:id) */}
      {viewingHistoryCliente && (
        <Modal
          isOpen={Boolean(viewingHistoryCliente)}
          onClose={() => setViewingHistoryCliente(null)}
          title={`Historial de Citas: ${viewingHistoryCliente.nombre}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Consultando endpoint: <code>/api/citas/cliente/{viewingHistoryCliente.id}</code>
              </p>
              {onOpenAgendarConCliente && (
                <button
                  onClick={() => {
                    const c = viewingHistoryCliente;
                    setViewingHistoryCliente(null);
                    onOpenAgendarConCliente(c);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Agendar Nueva Cita
                </button>
              )}
            </div>

            {isLoadingHistory ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }}>
                <div className="spinner" />
              </div>
            ) : clientCitas.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <CalendarCheck size={32} color="#64748b" />
                <p style={{ fontWeight: 600, color: '#e2e8f0', marginTop: '0.5rem' }}>
                  Este paciente no tiene citas registradas
                </p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Agéndale una consulta con cualquiera de nuestros especialistas.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                {clientCitas.map((cita) => {
                  const dateObj = new Date(cita.fechaHora);
                  return (
                    <div
                      key={cita.id}
                      style={{
                        padding: '0.9rem 1.1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>
                            {cita.servicio?.nombre}
                          </span>
                          <span className={`badge badge-${(cita.estado || 'PENDIENTE').toLowerCase()}`}>
                            <span className="badge-dot" />
                            {cita.estado}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Atendido por: {cita.profesional?.nombre} ({cita.profesional?.especialidad})
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                          Fecha: {dateObj.toLocaleString()} • Motivo: {cita.motivo}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#34d399' }}>
                          ${cita.servicio?.precio ? cita.servicio.precio.toFixed(2) : '0.00'}
                        </span>
                        <div style={{ marginTop: '0.2rem' }}>
                          {cita.pago ? (
                            <span className="badge badge-paid" style={{ fontSize: '0.68rem' }}>
                              <CheckCircle2 size={10} /> Pagado
                            </span>
                          ) : (
                            <span className="badge badge-unpaid" style={{ fontSize: '0.68rem' }}>
                              Pendiente
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingHistoryCliente(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

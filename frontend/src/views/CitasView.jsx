import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Stethoscope,
  X,
} from 'lucide-react';
import Modal from '../components/Modal';

export default function CitasView({
  citas = [],
  clientes = [],
  profesionales = [],
  servicios = [],
  onOpenAgendar,
  onEditCita,
  onDeleteCita,
  onOpenPago,
  onFilterByCliente,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedClienteFilter, setSelectedClienteFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('TODOS');
  const [viewingCita, setViewingCita] = useState(null);

  // Filter appointments
  const filteredCitas = citas.filter((cita) => {
    // Search query
    const searchLower = search.toLowerCase();
    const clienteName = cita.cliente?.nombre?.toLowerCase() || '';
    const profName = cita.profesional?.nombre?.toLowerCase() || '';
    const servName = cita.servicio?.nombre?.toLowerCase() || '';
    const motivo = cita.motivo?.toLowerCase() || '';
    const matchesSearch =
      !search ||
      clienteName.includes(searchLower) ||
      profName.includes(searchLower) ||
      servName.includes(searchLower) ||
      motivo.includes(searchLower) ||
      cita.id.toString().includes(searchLower);

    // Status filter
    const matchesStatus = statusFilter === 'TODOS' || cita.estado === statusFilter;

    // Client filter
    const matchesClient =
      !selectedClienteFilter ||
      cita.cliente?.id === Number(selectedClienteFilter) ||
      cita.clienteId === Number(selectedClienteFilter);

    // Payment filter
    const isPaid = Boolean(cita.pago);
    const matchesPayment =
      paymentFilter === 'TODOS' ||
      (paymentFilter === 'PAGADO' && isPaid) ||
      (paymentFilter === 'SIN_PAGO' && !isPaid);

    return matchesSearch && matchesStatus && matchesClient && matchesPayment;
  });

  const handleClienteFilterChange = (e) => {
    const val = e.target.value;
    setSelectedClienteFilter(val);
    if (onFilterByCliente && val) {
      onFilterByCliente(Number(val));
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            Gestión Integral de Citas Médicas
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Visualiza, reprograma, gestiona pagos y supervisa el estado de cada cita
          </p>
        </div>

        <button onClick={onOpenAgendar} className="btn btn-primary">
          <Plus size={16} />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Buscar por paciente, doctor, servicio..."
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

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CONFIRMADA">CONFIRMADA</option>
              <option value="COMPLETADA">COMPLETADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>

          {/* Client Filter */}
          <div>
            <select
              className="form-select"
              value={selectedClienteFilter}
              onChange={handleClienteFilterChange}
            >
              <option value="">Filtrar por Paciente (Todos)</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              className="form-select"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="TODOS">Todos los Pagos</option>
              <option value="PAGADO">Solo Pagados</option>
              <option value="SIN_PAGO">Pendientes de Pago</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="glass-panel">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
            Mostrando {filteredCitas.length} de {citas.length} citas
          </span>
          {(search || statusFilter !== 'TODOS' || selectedClienteFilter || paymentFilter !== 'TODOS') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('TODOS');
                setSelectedClienteFilter('');
                setPaymentFilter('TODOS');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', color: '#f43f5e' }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {filteredCitas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={28} />
            </div>
            <p style={{ fontWeight: 600, color: '#f8fafc' }}>No se encontraron citas</p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Prueba modificando tus filtros o agenda una nueva cita en el sistema.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha & Hora</th>
                  <th>Paciente / Cliente</th>
                  <th>Especialista</th>
                  <th>Servicio & Precio</th>
                  <th>Estado</th>
                  <th>Pago (1 a 1)</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCitas.map((cita) => {
                  const dateObj = new Date(cita.fechaHora);
                  const isPaid = Boolean(cita.pago);
                  const statusClass = `badge-${(cita.estado || 'PENDIENTE').toLowerCase()}`;

                  return (
                    <tr key={cita.id}>
                      <td style={{ fontWeight: 700, color: '#64748b' }}>
                        #{cita.id}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} color="#06b6d4" />
                          <div>
                            <p style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.88rem' }}>
                              {dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' })}
                            </p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: '#f8fafc' }}>
                            {cita.cliente?.nombre || `ID: ${cita.clienteId}`}
                          </p>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                            {cita.cliente?.telefono || cita.cliente?.email || 'Sin contacto'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p style={{ fontWeight: 500, color: '#cbd5e1' }}>
                            {cita.profesional?.nombre || `ID: ${cita.profesionalId}`}
                          </p>
                          <span style={{ fontSize: '0.74rem', color: '#38bdf8' }}>
                            {cita.profesional?.especialidad || 'Especialista'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: '#f8fafc' }}>
                            {cita.servicio?.nombre || `ID: ${cita.servicioId}`}
                          </p>
                          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                            ${cita.servicio?.precio ? cita.servicio.precio.toFixed(2) : '0.00'}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: '6px' }}>
                            ({cita.servicio?.duracionMinutos || 30}m)
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusClass}`}>
                          <span className="badge-dot" />
                          {cita.estado}
                        </span>
                      </td>
                      <td>
                        {isPaid ? (
                          <div>
                            <span className="badge badge-paid" title={`Comprobante #${cita.pago?.id}`}>
                              <CheckCircle2 size={12} /> Pagado
                            </span>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                              {cita.pago?.metodoPago} • ${Number(cita.pago?.monto).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenPago(cita)}
                            className="btn btn-emerald btn-sm"
                            style={{ padding: '0.3rem 0.65rem' }}
                          >
                            <CreditCard size={13} />
                            <span>Cobrar</span>
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            onClick={() => setViewingCita(cita)}
                            className="btn-icon btn-ghost"
                            title="Ver detalles"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => onEditCita(cita)}
                            className="btn-icon btn-ghost"
                            title="Reprogramar o editar cita"
                          >
                            <Edit2 size={15} color="#38bdf8" />
                          </button>
                          <button
                            onClick={() => onDeleteCita(cita)}
                            className="btn-icon btn-ghost"
                            title="Eliminar cita"
                          >
                            <Trash2 size={15} color="#fb7185" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {viewingCita && (
        <Modal
          isOpen={Boolean(viewingCita)}
          onClose={() => setViewingCita(null)}
          title={`Detalle de la Cita Médica #${viewingCita.id}`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge badge-${(viewingCita.estado || 'PENDIENTE').toLowerCase()}`}>
                <span className="badge-dot" />
                {viewingCita.estado}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Registrada en el sistema
              </span>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                Fecha y Hora de Atención
              </p>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                {new Date(viewingCita.fechaHora).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Paciente
                </p>
                <p style={{ fontWeight: 700, color: '#f8fafc' }}>{viewingCita.cliente?.nombre}</p>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{viewingCita.cliente?.email}</p>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{viewingCita.cliente?.telefono}</p>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Especialista
                </p>
                <p style={{ fontWeight: 700, color: '#f8fafc' }}>{viewingCita.profesional?.nombre}</p>
                <p style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{viewingCita.profesional?.especialidad}</p>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{viewingCita.profesional?.email}</p>
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                Servicio Contratado
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#f8fafc' }}>{viewingCita.servicio?.nombre}</p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{viewingCita.servicio?.descripcion}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 800, fontSize: '1.15rem', color: '#34d399' }}>
                    ${viewingCita.servicio?.precio ? viewingCita.servicio.precio.toFixed(2) : '0.00'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {viewingCita.servicio?.duracionMinutos} minutos
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                Motivo / Observaciones Clínicas
              </p>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {viewingCita.motivo || 'Sin observaciones'}
              </p>
            </div>

            {/* Payment Section */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: viewingCita.pago ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)', border: `1px solid ${viewingCita.pago ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 700, color: viewingCita.pago ? '#34d399' : '#fb7185' }}>
                    {viewingCita.pago ? 'Comprobante de Pago Registrado' : 'Pago Pendiente'}
                  </p>
                  {viewingCita.pago ? (
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Comprobante #{viewingCita.pago.id} • Método: {viewingCita.pago.metodoPago} • Fecha: {new Date(viewingCita.pago.fechaPago).toLocaleString()}
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Esta cita aún no registra ningún pago asociado en caja.
                    </p>
                  )}
                </div>

                {!viewingCita.pago && (
                  <button
                    onClick={() => {
                      const c = viewingCita;
                      setViewingCita(null);
                      onOpenPago(c);
                    }}
                    className="btn btn-emerald btn-sm"
                  >
                    <CreditCard size={14} /> Cobrar Cita
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingCita(null)}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const c = viewingCita;
                  setViewingCita(null);
                  onEditCita(c);
                }}
              >
                <Edit2 size={15} /> Editar o Reprogramar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

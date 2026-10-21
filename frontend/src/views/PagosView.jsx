import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Receipt,
  ArrowUpRight,
  X,
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function PagosView({
  pagos = [],
  citas = [],
  onOpenNuevoPago,
  onDeletePago,
}) {
  const [search, setSearch] = useState('');
  const [metodoFilter, setMetodoFilter] = useState('TODOS');

  // Revenue totals
  const totalRecaudado = pagos.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);
  const pagosTarjeta = pagos.filter((p) => p.metodoPago === 'TARJETA');
  const pagosEfectivo = pagos.filter((p) => p.metodoPago === 'EFECTIVO');
  const pagosTransferencia = pagos.filter((p) => p.metodoPago === 'TRANSFERENCIA');

  const montoTarjeta = pagosTarjeta.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);
  const montoEfectivo = pagosEfectivo.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);
  const montoTransferencia = pagosTransferencia.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);

  const citasSinPago = citas.filter((c) => !c.pago && c.estado !== 'CANCELADA');

  // Filter payments
  const filteredPagos = pagos.filter((p) => {
    const q = search.toLowerCase();
    const citaAsociada = citas.find((c) => c.id === p.citaId);
    const clienteNombre = citaAsociada?.cliente?.nombre?.toLowerCase() || '';

    const matchesSearch =
      !search ||
      p.id.toString().includes(q) ||
      p.citaId.toString().includes(q) ||
      p.metodoPago.toLowerCase().includes(q) ||
      clienteNombre.includes(q);

    const matchesMetodo = metodoFilter === 'TODOS' || p.metodoPago === metodoFilter;

    return matchesSearch && matchesMetodo;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            Caja, Comprobantes y Facturación
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Registro de comprobantes de pago asociados a citas médicas (Relación 1 a 1 estricta)
          </p>
        </div>

        <button
          onClick={() => onOpenNuevoPago()}
          className="btn btn-emerald"
          disabled={citasSinPago.length === 0}
        >
          <Plus size={16} />
          <span>Registrar Nuevo Pago ({citasSinPago.length} por cobrar)</span>
        </button>
      </div>

      {/* Financial Summary KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <StatCard
          title="Recaudación Total"
          value={`$${totalRecaudado.toFixed(2)}`}
          subtitle={`${pagos.length} cobros procesados`}
          icon={DollarSign}
          gradient="var(--gradient-emerald)"
          glowColor="rgba(16, 185, 129, 0.25)"
        />

        <StatCard
          title="Cobros con Tarjeta"
          value={`$${montoTarjeta.toFixed(2)}`}
          subtitle={`${pagosTarjeta.length} transacciones`}
          icon={CreditCard}
          gradient="var(--gradient-primary)"
          glowColor="rgba(6, 182, 212, 0.25)"
        />

        <StatCard
          title="Efectivo & Transferencias"
          value={`$${(montoEfectivo + montoTransferencia).toFixed(2)}`}
          subtitle={`${pagosEfectivo.length} efectivo • ${pagosTransferencia.length} transfs.`}
          icon={Receipt}
          gradient="var(--gradient-accent)"
          glowColor="rgba(99, 102, 241, 0.25)"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Buscar por # de comprobante, # de cita o paciente..."
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

          <div style={{ width: '220px' }}>
            <select
              className="form-select"
              value={metodoFilter}
              onChange={(e) => setMetodoFilter(e.target.value)}
            >
              <option value="TODOS">Todos los Métodos</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="glass-panel">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
            Mostrando {filteredPagos.length} de {pagos.length} comprobantes de pago
          </span>
        </div>

        {filteredPagos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Receipt size={28} />
            </div>
            <p style={{ fontWeight: 600, color: '#f8fafc' }}>No se encontraron comprobantes de pago</p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Registra los pagos de las citas médicas agendadas.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Comprobante</th>
                  <th>Cita Médica</th>
                  <th>Paciente</th>
                  <th>Método de Pago</th>
                  <th>Fecha de Cobro</th>
                  <th>Monto Pagado</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPagos.map((pago) => {
                  const citaAsociada = citas.find((c) => c.id === pago.citaId);
                  const dateObj = pago.fechaPago ? new Date(pago.fechaPago) : new Date();

                  return (
                    <tr key={pago.id}>
                      <td style={{ fontWeight: 700, color: '#38bdf8' }}>
                        REC-{String(pago.id).padStart(4, '0')}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#cbd5e1' }}>
                          Cita #{pago.citaId}
                        </span>
                        {citaAsociada?.servicio && (
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                            {citaAsociada.servicio.nombre}
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: '#f8fafc' }}>
                            {citaAsociada?.cliente?.nombre || 'Paciente no disponible'}
                          </p>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                            {citaAsociada?.profesional?.nombre ? `Dr(a). ${citaAsociada.profesional.nombre}` : ''}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            background:
                              pago.metodoPago === 'TARJETA'
                                ? 'rgba(6, 182, 212, 0.12)'
                                : pago.metodoPago === 'EFECTIVO'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(99, 102, 241, 0.12)',
                            color:
                              pago.metodoPago === 'TARJETA'
                                ? '#38bdf8'
                                : pago.metodoPago === 'EFECTIVO'
                                ? '#34d399'
                                : '#818cf8',
                            border: '1px solid currentColor',
                          }}
                        >
                          {pago.metodoPago}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                          {dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          {dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#34d399' }}>
                          ${Number(pago.monto).toFixed(2)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => onDeletePago(pago)}
                          className="btn-icon btn-ghost"
                          title="Eliminar comprobante de pago"
                        >
                          <Trash2 size={15} color="#fb7185" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

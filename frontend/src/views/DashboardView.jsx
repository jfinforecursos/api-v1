import React from 'react';
import {
  CalendarCheck,
  CreditCard,
  Users,
  Stethoscope,
  Plus,
  Clock,
  ArrowRight,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DashboardView({
  citas = [],
  clientes = [],
  profesionales = [],
  servicios = [],
  pagos = [],
  onNavigate,
  onOpenAgendar,
  onOpenPago,
  onOpenNuevoCliente,
  onOpenNuevoProfesional,
  onEditCita,
  onDeleteCita,
}) {
  // Calculations
  const totalCitas = citas.length;
  const citasPendientes = citas.filter((c) => c.estado === 'PENDIENTE').length;
  const citasConfirmadas = citas.filter((c) => c.estado === 'CONFIRMADA').length;
  const citasCompletadas = citas.filter((c) => c.estado === 'COMPLETADA').length;
  const citasCanceladas = citas.filter((c) => c.estado === 'CANCELADA').length;

  const totalIngresos = pagos.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);
  const citasSinPago = citas.filter((c) => !c.pago && c.estado !== 'CANCELADA');

  // Next upcoming appointments (sorted by date)
  const proximasCitas = [...citas]
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
    .slice(0, 5);

  const ultimosPagos = [...pagos]
    .sort((a, b) => new Date(b.fechaPago || 0) - new Date(a.fechaPago || 0))
    .slice(0, 4);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Welcome */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
          borderColor: 'rgba(6, 182, 212, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Centro de Operaciones Médicas
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
            Panel de Control y Monitoreo en Tiempo Real
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Gestiona citas médicas, expedientes de pacientes, profesionales de la salud y facturación en un solo lugar.
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={onOpenAgendar} className="btn btn-primary">
            <Plus size={16} />
            <span>Agendar Cita</span>
          </button>
          <button
            onClick={() => onOpenPago()}
            className="btn btn-emerald"
            disabled={citasSinPago.length === 0}
            title={citasSinPago.length === 0 ? 'No hay citas pendientes de pago' : 'Registrar Pago'}
          >
            <CreditCard size={16} />
            <span>Registrar Pago ({citasSinPago.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <StatCard
          title="Total de Citas"
          value={totalCitas}
          subtitle={`${citasPendientes} pendientes de atención`}
          icon={CalendarCheck}
          gradient="var(--gradient-primary)"
          glowColor="rgba(6, 182, 212, 0.25)"
          onClick={() => onNavigate('citas')}
        />

        <StatCard
          title="Recaudación de Caja"
          value={`$${totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`${pagos.length} comprobantes registrados`}
          icon={CreditCard}
          gradient="var(--gradient-emerald)"
          glowColor="rgba(16, 185, 129, 0.25)"
          onClick={() => onNavigate('pagos')}
        />

        <StatCard
          title="Directorio de Pacientes"
          value={clientes.length}
          subtitle="Historial médico activo"
          icon={Users}
          gradient="var(--gradient-accent)"
          glowColor="rgba(99, 102, 241, 0.25)"
          onClick={() => onNavigate('clientes')}
        />

        <StatCard
          title="Especialistas y Servicios"
          value={`${profesionales.length} / ${servicios.length}`}
          subtitle="Doctores y catálogo médico"
          icon={Stethoscope}
          gradient="linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)"
          glowColor="rgba(245, 158, 11, 0.25)"
          onClick={() => onNavigate('profesionales')}
        />
      </div>

      {/* Main Grid: Upcoming Schedule & Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {/* Left Column: Agenda Próxima */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                Próximas Citas Médicas
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Turnos organizados cronológicamente
              </p>
            </div>
            <button
              onClick={() => onNavigate('citas')}
              className="btn btn-ghost btn-sm"
              style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Ver todas</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {proximasCitas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CalendarCheck size={28} />
              </div>
              <p style={{ fontWeight: 600, color: '#cbd5e1' }}>No hay citas agendadas</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
                Comienza agendando la primera cita médica del consultorio.
              </p>
              <button onClick={onOpenAgendar} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                <Plus size={14} /> Agendar Cita
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {proximasCitas.map((cita) => {
                const dateObj = new Date(cita.fechaHora);
                const isPaid = Boolean(cita.pago);
                const statusClass = `badge-${(cita.estado || 'PENDIENTE').toLowerCase()}`;

                return (
                  <div
                    key={cita.id}
                    style={{
                      padding: '1rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(6, 182, 212, 0.1)',
                          color: '#38bdf8',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          {dateObj.toLocaleDateString('es-ES', { month: 'short' })}
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                          {dateObj.getDate()}
                        </span>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                            {cita.cliente?.nombre || `Cliente #${cita.clienteId}`}
                          </span>
                          <span className={`badge ${statusClass}`}>
                            <span className="badge-dot" />
                            {cita.estado}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {cita.servicio?.nombre} • {cita.profesional?.nombre} • {dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isPaid ? (
                        <span className="badge badge-paid" title={`Pagado $${cita.pago?.monto}`}>
                          <CheckCircle2 size={12} /> Pagado
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenPago(cita)}
                          className="btn btn-emerald btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Cobrar cita ahora"
                        >
                          <CreditCard size={13} />
                          <span>Cobrar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Status Breakdown & Latest Payments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Breakdown Panel */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>
              Estado del Flujo de Citas
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
              Distribución actual de las {totalCitas} citas registradas
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                { label: 'Pendientes por Atender', count: citasPendientes, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' },
                { label: 'Confirmadas', count: citasConfirmadas, color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
                { label: 'Completadas', count: citasCompletadas, color: '#38bdf8', bg: 'rgba(6, 182, 212, 0.15)' },
                { label: 'Canceladas', count: citasCanceladas, color: '#fb7185', bg: 'rgba(244, 63, 94, 0.15)' },
              ].map((item) => {
                const pct = totalCitas > 0 ? Math.round((item.count / totalCitas) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: '7px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: item.color,
                          borderRadius: '999px',
                          transition: 'width 0.5s ease-out',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Recaudación / Facturación Reciente */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                Cobros Recientes
              </h3>
              <button
                onClick={() => onNavigate('pagos')}
                className="btn btn-ghost btn-sm"
                style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Ver caja</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {ultimosPagos.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>
                Aún no hay comprobantes de pago registrados.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {ultimosPagos.map((pago) => (
                  <div
                    key={pago.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                        Recibo #{pago.id} • Cita #{pago.citaId}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {pago.metodoPago} • {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString() : 'Hoy'}
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#34d399' }}>
                      +${Number(pago.monto).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

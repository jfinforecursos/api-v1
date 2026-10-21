import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { DollarSign, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';

export default function PagoModal({
  isOpen,
  onClose,
  onSubmit,
  cita = null,
  citasSinPago = [],
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    citaId: '',
    monto: '',
    metodoPago: 'TARJETA',
    fechaPago: '',
  });

  useEffect(() => {
    if (cita) {
      const now = new Date().toISOString().slice(0, 16);
      setFormData({
        citaId: cita.id,
        monto: cita.servicio?.precio || '',
        metodoPago: 'TARJETA',
        fechaPago: now,
      });
    } else if (citasSinPago.length > 0) {
      const first = citasSinPago[0];
      const now = new Date().toISOString().slice(0, 16);
      setFormData({
        citaId: first.id,
        monto: first.servicio?.precio || '',
        metodoPago: 'TARJETA',
        fechaPago: now,
      });
    } else {
      setFormData({
        citaId: '',
        monto: '',
        metodoPago: 'TARJETA',
        fechaPago: '',
      });
    }
  }, [cita, citasSinPago, isOpen]);

  const handleCitaChange = (e) => {
    const selectedId = Number(e.target.value);
    const selected = citasSinPago.find((c) => c.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      citaId: selectedId,
      monto: selected?.servicio?.precio || prev.monto,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      citaId: Number(formData.citaId),
      monto: parseFloat(formData.monto),
      metodoPago: formData.metodoPago,
      fechaPago: formData.fechaPago || null,
    };
    onSubmit(payload);
  };

  const selectedCita = cita || citasSinPago.find((c) => c.id === Number(formData.citaId));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Comprobante de Pago"
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit}>
        {/* Info card of the appointment being paid */}
        {selectedCita && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                Cita #{selectedCita.id}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {selectedCita.fechaHora ? new Date(selectedCita.fechaHora).toLocaleString() : ''}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>
              Paciente: {selectedCita.cliente?.nombre || 'N/A'}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Servicio: {selectedCita.servicio?.nombre} • Atiende: {selectedCita.profesional?.nombre}
            </p>
          </div>
        )}

        {/* If no specific cita passed, let user choose from unpaid appointments */}
        {!cita && (
          <div className="form-group">
            <label className="form-label">
              <Calendar size={15} /> Seleccionar Cita Pendiente de Pago *
            </label>
            <select
              name="citaId"
              value={formData.citaId}
              onChange={handleCitaChange}
              className="form-select"
              required
            >
              <option value="">-- Seleccionar cita --</option>
              {citasSinPago.map((c) => (
                <option key={c.id} value={c.id}>
                  Cita #{c.id} - {c.cliente?.nombre} ({c.servicio?.nombre} - ${c.servicio?.precio?.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row">
          {/* Monto */}
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={15} /> Monto a Pagar ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>

          {/* Método de Pago */}
          <div className="form-group">
            <label className="form-label">
              <CreditCard size={15} /> Método de Pago *
            </label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="TARJETA">TARJETA (Débito/Crédito)</option>
              <option value="EFECTIVO">EFECTIVO</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA BANCARIA</option>
            </select>
          </div>
        </div>

        {/* Fecha y Hora del Pago */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={15} /> Fecha y Hora del Comprobante
          </label>
          <input
            type="datetime-local"
            name="fechaPago"
            value={formData.fechaPago}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-emerald"
            disabled={isLoading || !formData.citaId}
          >
            {isLoading ? (
              <div className="spinner" style={{ width: '16px', height: '16px' }} />
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Confirmar Pago</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

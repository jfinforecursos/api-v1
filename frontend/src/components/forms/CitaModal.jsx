import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { Calendar, User, Stethoscope, Clock, FileText, CheckCircle } from 'lucide-react';

export default function CitaModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  clientes = [],
  profesionales = [],
  servicios = [],
  isLoading = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    clienteId: '',
    profesionalId: '',
    servicioId: '',
    fechaHora: '',
    motivo: '',
    estado: 'PENDIENTE',
  });

  useEffect(() => {
    if (initialData) {
      // Format ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
      let formattedDate = '';
      if (initialData.fechaHora) {
        const d = new Date(initialData.fechaHora);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().slice(0, 16);
        } else {
          formattedDate = initialData.fechaHora.slice(0, 16);
        }
      }

      setFormData({
        clienteId: initialData.cliente?.id || initialData.clienteId || '',
        profesionalId: initialData.profesional?.id || initialData.profesionalId || '',
        servicioId: initialData.servicio?.id || initialData.servicioId || '',
        fechaHora: formattedDate,
        motivo: initialData.motivo || '',
        estado: initialData.estado || 'PENDIENTE',
      });
    } else {
      // Default date tomorrow at 10:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const defaultDate = tomorrow.toISOString().slice(0, 16);

      setFormData({
        clienteId: clientes.length > 0 ? clientes[0].id : '',
        profesionalId: profesionales.length > 0 ? profesionales[0].id : '',
        servicioId: servicios.length > 0 ? servicios[0].id : '',
        fechaHora: defaultDate,
        motivo: '',
        estado: 'PENDIENTE',
      });
    }
  }, [initialData, isOpen, clientes, profesionales, servicios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      clienteId: Number(formData.clienteId),
      profesionalId: Number(formData.profesionalId),
      servicioId: Number(formData.servicioId),
      fechaHora: formData.fechaHora,
      motivo: formData.motivo,
      estado: formData.estado,
    };
    onSubmit(payload, initialData?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Cita #${initialData?.id}` : 'Agendar Nueva Cita'}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {/* Cliente Select */}
          <div className="form-group">
            <label className="form-label">
              <User size={15} /> Cliente / Paciente *
            </label>
            <select
              name="clienteId"
              value={formData.clienteId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Seleccionar cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.email || c.telefono || `ID ${c.id}`})
                </option>
              ))}
            </select>
          </div>

          {/* Profesional Select */}
          <div className="form-group">
            <label className="form-label">
              <Stethoscope size={15} /> Especialista Asignado *
            </label>
            <select
              name="profesionalId"
              value={formData.profesionalId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Seleccionar profesional --</option>
              {profesionales.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - {p.especialidad}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          {/* Servicio Select */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={15} /> Servicio Médico *
            </label>
            <select
              name="servicioId"
              value={formData.servicioId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Seleccionar servicio --</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} (${s.precio ? s.precio.toFixed(2) : '0.00'} • {s.duracionMinutos}m)
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={15} /> Fecha y Hora *
            </label>
            <input
              type="datetime-local"
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Motivo de la Cita */}
        <div className="form-group">
          <label className="form-label">
            <FileText size={15} /> Motivo u Observaciones Clínicas *
          </label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            rows={2}
            className="form-textarea"
            placeholder="Ej. Limpieza dental rutinaria, control postoperatorio o dolor recurrente..."
            required
          />
        </div>

        {/* Estado (solo visible si es edición o para cambiarlo) */}
        <div className="form-group">
          <label className="form-label">
            <CheckCircle size={15} /> Estado de la Cita
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="form-select"
          >
            <option value="PENDIENTE">PENDIENTE (Por atender)</option>
            <option value="CONFIRMADA">CONFIRMADA (Paciente confirmó)</option>
            <option value="COMPLETADA">COMPLETADA (Atención finalizada)</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
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
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner" style={{ width: '16px', height: '16px' }} />
            ) : isEditing ? (
              'Guardar Cambios'
            ) : (
              'Agendar Cita'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

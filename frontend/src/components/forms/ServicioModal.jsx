import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { Stethoscope, DollarSign, Clock, FileText, Check } from 'lucide-react';

export default function ServicioModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracionMinutos: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        precio: initialData.precio !== undefined ? initialData.precio : '',
        duracionMinutos: initialData.duracionMinutos !== undefined ? initialData.duracionMinutos : '',
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        duracionMinutos: '30',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      duracionMinutos: parseInt(formData.duracionMinutos, 10),
    };
    onSubmit(payload, initialData?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Servicio #${initialData?.id}` : 'Registrar Nuevo Servicio Médico'}
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <Stethoscope size={15} /> Nombre del Servicio *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej. Consulta Médica General, Limpieza Dental..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FileText size={15} /> Descripción Detallada
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={2}
            className="form-textarea"
            placeholder="Descripción del procedimiento, indicaciones previas o detalles clínicos..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={15} /> Precio ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="form-input"
              placeholder="50.00"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Clock size={15} /> Duración Estimada (Minutos) *
            </label>
            <input
              type="number"
              min="5"
              step="5"
              name="duracionMinutos"
              value={formData.duracionMinutos}
              onChange={handleChange}
              className="form-input"
              placeholder="45"
              required
            />
          </div>
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
              <>
                <Check size={16} />
                <span>Crear Servicio</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

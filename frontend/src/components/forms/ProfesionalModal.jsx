import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { User, Award, Mail, Phone, Check } from 'lucide-react';

export default function ProfesionalModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        especialidad: initialData.especialidad || '',
        email: initialData.email || '',
        telefono: initialData.telefono || '',
      });
    } else {
      setFormData({
        nombre: '',
        especialidad: '',
        email: '',
        telefono: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, initialData?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Especialista #${initialData?.id}` : 'Registrar Nuevo Especialista'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <User size={15} /> Nombre y Título Profesional *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej. Dr. Alejandro Méndez"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Award size={15} /> Especialidad o Área Médica *
          </label>
          <input
            type="text"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej. Cardiología, Ortodoncia, Dermatología..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Mail size={15} /> Correo Profesional *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="a.mendez@clinica.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={15} /> Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="form-input"
              placeholder="555-9876"
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
                <span>Registrar Especialista</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { User, Mail, Phone, Check } from 'lucide-react';

export default function ClienteModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        email: initialData.email || '',
        telefono: initialData.telefono || '',
      });
    } else {
      setFormData({
        nombre: '',
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
      title={isEditing ? `Editar Paciente #${initialData?.id}` : 'Registrar Nuevo Paciente'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <User size={15} /> Nombre Completo *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej. María Fernanda Gómez"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail size={15} /> Correo Electrónico *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="maria.gomez@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Phone size={15} /> Teléfono de Contacto *
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-input"
            placeholder="555-0192"
            required
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
                <span>Registrar Paciente</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import ConfirmModal from './components/ConfirmModal';

// Modals
import CitaModal from './components/forms/CitaModal';
import PagoModal from './components/forms/PagoModal';
import ClienteModal from './components/forms/ClienteModal';
import ProfesionalModal from './components/forms/ProfesionalModal';
import ServicioModal from './components/forms/ServicioModal';

// Views
import DashboardView from './views/DashboardView';
import CitasView from './views/CitasView';
import ClientesView from './views/ClientesView';
import ProfesionalesView from './views/ProfesionalesView';
import ServiciosView from './views/ServiciosView';
import PagosView from './views/PagosView';
import ApiDocsView from './views/ApiDocsView';

// API Client
import {
  citasApi,
  clientesApi,
  profesionalesApi,
  serviciosApi,
  pagosApi,
  healthApi,
} from './api/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data State
  const [citas, setCitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [pagos, setPagos] = useState([]);

  // Health and Loading State
  const [backendOnline, setBackendOnline] = useState(true);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };
  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modal States
  const [citaModal, setCitaModal] = useState({ isOpen: false, data: null });
  const [pagoModal, setPagoModal] = useState({ isOpen: false, cita: null });
  const [clienteModal, setClienteModal] = useState({ isOpen: false, data: null });
  const [profesionalModal, setProfesionalModal] = useState({ isOpen: false, data: null });
  const [servicioModal, setServicioModal] = useState({ isOpen: false, data: null });

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Eliminar',
    onConfirm: () => {},
    isLoading: false,
  });

  // -------------------------------------------------------------
  // Data Loading & Health Checks
  // -------------------------------------------------------------
  const checkHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    const result = await healthApi.check();
    setBackendOnline(result.online);
    setIsCheckingHealth(false);
    return result.online;
  }, []);

  const loadAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const isOnline = await checkHealth();
      if (!isOnline) {
        setIsLoadingData(false);
        return;
      }

      const [resCitas, resClientes, resProfesionales, resServicios, resPagos] =
        await Promise.allSettled([
          citasApi.getAll(),
          clientesApi.getAll(),
          profesionalesApi.getAll(),
          serviciosApi.getAll(),
          pagosApi.getAll(),
        ]);

      if (resCitas.status === 'fulfilled') setCitas(resCitas.value || []);
      if (resClientes.status === 'fulfilled') setClientes(resClientes.value || []);
      if (resProfesionales.status === 'fulfilled') setProfesionales(resProfesionales.value || []);
      if (resServicios.status === 'fulfilled') setServicios(resServicios.value || []);
      if (resPagos.status === 'fulfilled') setPagos(resPagos.value || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [checkHealth]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // -------------------------------------------------------------
  // CITAS HANDLERS
  // -------------------------------------------------------------
  const handleSaveCita = async (payload, id) => {
    try {
      if (id) {
        await citasApi.update(id, payload);
        addToast('success', 'Cita Actualizada', `La cita #${id} fue actualizada o reprogramada con éxito.`);
      } else {
        const nueva = await citasApi.create(payload);
        addToast('success', 'Cita Agendada', `Cita #${nueva.id} agendada correctamente.`);
      }
      setCitaModal({ isOpen: false, data: null });
      loadAllData();
    } catch (err) {
      addToast('error', 'Error al procesar cita', err.message);
    }
  };

  const handleDeleteCita = (cita) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Cancelar/Eliminar Cita #${cita.id}?`,
      message: `¿Estás seguro de que deseas eliminar permanentemente la cita de ${cita.cliente?.nombre || 'este paciente'}?`,
      confirmText: 'Eliminar Cita',
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await citasApi.delete(cita.id);
          addToast('success', 'Cita Eliminada', `La cita #${cita.id} ha sido eliminada del sistema.`);
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          loadAllData();
        } catch (err) {
          setConfirmModal((prev) => ({ ...prev, isLoading: false }));
          addToast('error', 'Error al eliminar', err.message);
        }
      },
    });
  };

  // -------------------------------------------------------------
  // PAGOS HANDLERS
  // -------------------------------------------------------------
  const handleSavePago = async (payload) => {
    try {
      const nuevo = await pagosApi.create(payload);
      addToast('success', 'Pago Registrado', `Comprobante #${nuevo.id} registrado por $${Number(nuevo.monto).toFixed(2)}.`);
      setPagoModal({ isOpen: false, cita: null });
      loadAllData();
    } catch (err) {
      addToast('error', 'Error al registrar pago', err.message);
    }
  };

  const handleDeletePago = (pago) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar Comprobante #${pago.id}?`,
      message: `Se eliminará el recibo de pago por $${Number(pago.monto).toFixed(2)} asociado a la cita #${pago.citaId}.`,
      confirmText: 'Eliminar Pago',
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await pagosApi.delete(pago.id);
          addToast('success', 'Pago Eliminado', `Comprobante #${pago.id} eliminado correctamente.`);
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          loadAllData();
        } catch (err) {
          setConfirmModal((prev) => ({ ...prev, isLoading: false }));
          addToast('error', 'Error al eliminar pago', err.message);
        }
      },
    });
  };

  // -------------------------------------------------------------
  // CLIENTES HANDLERS
  // -------------------------------------------------------------
  const handleSaveCliente = async (payload, id) => {
    try {
      if (id) {
        await clientesApi.update(id, payload);
        addToast('success', 'Paciente Actualizado', `Los datos de ${payload.nombre} han sido actualizados.`);
      } else {
        const nuevo = await clientesApi.create(payload);
        addToast('success', 'Paciente Registrado', `${nuevo.nombre} fue dado de alta exitosamente.`);
      }
      setClienteModal({ isOpen: false, data: null });
      loadAllData();
    } catch (err) {
      addToast('error', 'Error con paciente', err.message);
    }
  };

  const handleDeleteCliente = (cliente) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar Paciente ${cliente.nombre}?`,
      message: 'Si este paciente tiene citas asociadas, primero deberás cancelarlas o reasignarlas.',
      confirmText: 'Eliminar Paciente',
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await clientesApi.delete(cliente.id);
          addToast('success', 'Paciente Eliminado', `${cliente.nombre} ha sido eliminado.`);
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          loadAllData();
        } catch (err) {
          setConfirmModal((prev) => ({ ...prev, isLoading: false }));
          addToast('error', 'No se pudo eliminar paciente', err.message);
        }
      },
    });
  };

  // -------------------------------------------------------------
  // PROFESIONALES HANDLERS
  // -------------------------------------------------------------
  const handleSaveProfesional = async (payload, id) => {
    try {
      if (id) {
        await profesionalesApi.update(id, payload);
        addToast('success', 'Especialista Actualizado', `Los datos de ${payload.nombre} han sido guardados.`);
      } else {
        const nuevo = await profesionalesApi.create(payload);
        addToast('success', 'Especialista Registrado', `${nuevo.nombre} (${nuevo.especialidad}) fue añadido al equipo.`);
      }
      setProfesionalModal({ isOpen: false, data: null });
      loadAllData();
    } catch (err) {
      addToast('error', 'Error con especialista', err.message);
    }
  };

  const handleDeleteProfesional = (prof) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar Especialista ${prof.nombre}?`,
      message: 'Esta acción removerá al especialista del directorio médico.',
      confirmText: 'Eliminar Especialista',
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await profesionalesApi.delete(prof.id);
          addToast('success', 'Especialista Eliminado', `${prof.nombre} ha sido eliminado.`);
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          loadAllData();
        } catch (err) {
          setConfirmModal((prev) => ({ ...prev, isLoading: false }));
          addToast('error', 'No se pudo eliminar especialista', err.message);
        }
      },
    });
  };

  // -------------------------------------------------------------
  // SERVICIOS HANDLERS
  // -------------------------------------------------------------
  const handleSaveServicio = async (payload, id) => {
    try {
      if (id) {
        await serviciosApi.update(id, payload);
        addToast('success', 'Servicio Actualizado', `Procedimiento "${payload.nombre}" actualizado.`);
      } else {
        const nuevo = await serviciosApi.create(payload);
        addToast('success', 'Servicio Creado', `Procedimiento "${nuevo.nombre}" añadido al catálogo.`);
      }
      setServicioModal({ isOpen: false, data: null });
      loadAllData();
    } catch (err) {
      addToast('error', 'Error con servicio', err.message);
    }
  };

  const handleDeleteServicio = (servicio) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar Servicio "${servicio.nombre}"?`,
      message: 'Se removerá este procedimiento del catálogo médico.',
      confirmText: 'Eliminar Servicio',
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await serviciosApi.delete(servicio.id);
          addToast('success', 'Servicio Eliminado', `"${servicio.nombre}" ha sido eliminado.`);
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          loadAllData();
        } catch (err) {
          setConfirmModal((prev) => ({ ...prev, isLoading: false }));
          addToast('error', 'No se pudo eliminar servicio', err.message);
        }
      },
    });
  };

  // Unpaid appointments calculation
  const citasSinPago = citas.filter((c) => !c.pago && c.estado !== 'CANCELADA');

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        counts={{
          citas: citas.length,
          clientes: clientes.length,
          profesionales: profesionales.length,
          servicios: servicios.length,
          pagos: pagos.length,
        }}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          backendOnline={backendOnline}
          isCheckingHealth={isCheckingHealth}
          onCheckHealth={checkHealth}
          onOpenAgendar={() => setCitaModal({ isOpen: true, data: null })}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Offline Warning Banner */}
        {!backendOnline && (
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.1) 100%)',
              borderBottom: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '0.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fb7185' }}>
                ⚠️ Servidor Spring Boot no detectado en http://localhost:8080
              </p>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Asegúrate de ejecutar la API backend con <code>./mvnw spring-boot:run</code> en una terminal.
              </p>
            </div>
            <button
              onClick={loadAllData}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#ffffff' }}
            >
              Reintentar Conexión
            </button>
          </div>
        )}

        {/* Content Container */}
        <main className="content-container">
          {activeTab === 'dashboard' && (
            <DashboardView
              citas={citas}
              clientes={clientes}
              profesionales={profesionales}
              servicios={servicios}
              pagos={pagos}
              onNavigate={setActiveTab}
              onOpenAgendar={() => setCitaModal({ isOpen: true, data: null })}
              onOpenPago={(cita) => setPagoModal({ isOpen: true, cita: cita || null })}
              onOpenNuevoCliente={() => setClienteModal({ isOpen: true, data: null })}
              onOpenNuevoProfesional={() => setProfesionalModal({ isOpen: true, data: null })}
              onEditCita={(cita) => setCitaModal({ isOpen: true, data: cita })}
              onDeleteCita={handleDeleteCita}
            />
          )}

          {activeTab === 'citas' && (
            <CitasView
              citas={citas}
              clientes={clientes}
              profesionales={profesionales}
              servicios={servicios}
              onOpenAgendar={() => setCitaModal({ isOpen: true, data: null })}
              onEditCita={(cita) => setCitaModal({ isOpen: true, data: cita })}
              onDeleteCita={handleDeleteCita}
              onOpenPago={(cita) => setPagoModal({ isOpen: true, cita: cita || null })}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientesView
              clientes={clientes}
              onOpenNuevoCliente={() => setClienteModal({ isOpen: true, data: null })}
              onEditCliente={(cliente) => setClienteModal({ isOpen: true, data: cliente })}
              onDeleteCliente={handleDeleteCliente}
              onOpenAgendarConCliente={(cliente) => {
                setCitaModal({ isOpen: true, data: { cliente } });
              }}
            />
          )}

          {activeTab === 'profesionales' && (
            <ProfesionalesView
              profesionales={profesionales}
              citas={citas}
              onOpenNuevoProfesional={() => setProfesionalModal({ isOpen: true, data: null })}
              onEditProfesional={(prof) => setProfesionalModal({ isOpen: true, data: prof })}
              onDeleteProfesional={handleDeleteProfesional}
            />
          )}

          {activeTab === 'servicios' && (
            <ServiciosView
              servicios={servicios}
              citas={citas}
              onOpenNuevoServicio={() => setServicioModal({ isOpen: true, data: null })}
              onEditServicio={(serv) => setServicioModal({ isOpen: true, data: serv })}
              onDeleteServicio={handleDeleteServicio}
            />
          )}

          {activeTab === 'pagos' && (
            <PagosView
              pagos={pagos}
              citas={citas}
              onOpenNuevoPago={() => setPagoModal({ isOpen: true, cita: null })}
              onDeletePago={handleDeletePago}
            />
          )}

          {activeTab === 'apidocs' && <ApiDocsView />}
        </main>
      </div>

      {/* Global Modals */}
      <CitaModal
        isOpen={citaModal.isOpen}
        onClose={() => setCitaModal({ isOpen: false, data: null })}
        onSubmit={handleSaveCita}
        initialData={citaModal.data}
        clientes={clientes}
        profesionales={profesionales}
        servicios={servicios}
      />

      <PagoModal
        isOpen={pagoModal.isOpen}
        onClose={() => setPagoModal({ isOpen: false, cita: null })}
        onSubmit={handleSavePago}
        cita={pagoModal.cita}
        citasSinPago={citasSinPago}
      />

      <ClienteModal
        isOpen={clienteModal.isOpen}
        onClose={() => setClienteModal({ isOpen: false, data: null })}
        onSubmit={handleSaveCliente}
        initialData={clienteModal.data}
      />

      <ProfesionalModal
        isOpen={profesionalModal.isOpen}
        onClose={() => setProfesionalModal({ isOpen: false, data: null })}
        onSubmit={handleSaveProfesional}
        initialData={profesionalModal.data}
      />

      <ServicioModal
        isOpen={servicioModal.isOpen}
        onClose={() => setServicioModal({ isOpen: false, data: null })}
        onSubmit={handleSaveServicio}
        initialData={servicioModal.data}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isLoading={confirmModal.isLoading}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

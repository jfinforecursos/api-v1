import {
  apiClientes,
  apiProfesionales,
  apiServicios,
  apiCitas,
  apiPagos,
  setLogCallback
} from './api.js';

// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================
const state = {
  currentView: 'landing',
  servicios: [],
  profesionales: [],
  clientes: [],
  citas: [],
  pagos: [],
  
  // Estado del Wizard de Agendamiento
  wizard: {
    step: 1,
    selectedService: null,
    selectedProfessional: null,
    selectedDate: '',
    selectedTime: '10:00',
    motivo: '',
    selectedClient: null
  },

  // Filtros de la agenda
  agendaFilter: 'TODAS',
  agendaSearch: ''
};

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupWizard();
  setupAgendaControls();
  setupDirectoryControls();
  setupPaymentModal();
  setupLabControls();
  setupHttpLogger();

  // Cargar datos iniciales
  await verificarConexionBackend();
  await recargarTodo();
});

// ============================================================================
// 1. NAVEGACIÓN ENTRE VISTAS
// ============================================================================
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const view = e.currentTarget.getAttribute('data-view');
      navigateView(view);
    });
  });

  // Botones de llamada a la acción hacia el Wizard
  document.getElementById('brand-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateView('landing');
  });

  document.getElementById('btn-quick-book')?.addEventListener('click', () => {
    resetWizard();
    navigateView('wizard');
  });

  document.getElementById('btn-hero-agendar')?.addEventListener('click', () => {
    resetWizard();
    navigateView('wizard');
  });

  document.getElementById('btn-hero-agenda')?.addEventListener('click', () => {
    navigateView('agenda');
  });

  document.getElementById('btn-banner-agendar')?.addEventListener('click', () => {
    resetWizard();
    navigateView('wizard');
  });

  document.getElementById('btn-agenda-new-booking')?.addEventListener('click', () => {
    resetWizard();
    navigateView('wizard');
  });
}

function navigateView(viewName) {
  state.currentView = viewName;

  // Actualizar clases de pestañas
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-view') === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Actualizar paneles visibles
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSection = document.getElementById(`view-${viewName}`);
  if (activeSection) {
    activeSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Refrescar vistas específicas según necesidad
  if (viewName === 'agenda') {
    renderAgendaCitas();
  } else if (viewName === 'pagos') {
    renderPagosTable();
  } else if (viewName === 'directorio') {
    renderDirectorio();
  }
}

// ============================================================================
// 2. CONEXIÓN Y CARGA DE DATOS DESDE LA API REST
// ============================================================================
async function verificarConexionBackend() {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  try {
    await apiServicios.listar();
    statusDot.classList.remove('error');
    statusText.textContent = 'Backend en línea 🟢';
  } catch (err) {
    statusDot.classList.add('error');
    statusText.textContent = 'Sin conexión 🔴';
  }
}

async function recargarTodo() {
  try {
    const [servicios, profesionales, clientes, citas, pagos] = await Promise.all([
      apiServicios.listar().catch(() => []),
      apiProfesionales.listar().catch(() => []),
      apiClientes.listar().catch(() => []),
      apiCitas.listar().catch(() => []),
      apiPagos.listar().catch(() => [])
    ]);

    state.servicios = servicios;
    state.profesionales = profesionales;
    state.clientes = clientes;
    state.citas = citas;
    state.pagos = pagos;

    actualizarEstadisticasLanding();
    renderLandingServicios();
    renderAgendaCitas();
    renderPagosTable();
    poblarSelectoresWizard();
  } catch (error) {
    mostrarToast('Error cargando datos del backend: ' + error.message, 'error');
  }
}

function actualizarEstadisticasLanding() {
  const elCitas = document.getElementById('stat-citas-count');
  const elProf = document.getElementById('stat-prof-count');
  const elServ = document.getElementById('stat-serv-count');

  if (elCitas) elCitas.textContent = state.citas.length || '12+';
  if (elProf) elProf.textContent = state.profesionales.length || '4';
  if (elServ) elServ.textContent = state.servicios.length || '4';
}

function renderLandingServicios() {
  const container = document.getElementById('landing-services-grid');
  if (!container) return;

  if (state.servicios.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted);">No hay servicios disponibles.</p>';
    return;
  }

  container.innerHTML = state.servicios.map(serv => `
    <div class="service-card">
      <div>
        <div class="service-header">
          <span class="service-badge">⏱️ ${serv.duracionMinutos} min</span>
        </div>
        <h3 class="service-title">${escapeHtml(serv.nombre)}</h3>
        <p class="service-desc">${escapeHtml(serv.descripcion || 'Servicio médico especializado con tecnología de vanguardia.')}</p>
      </div>
      <div class="service-footer">
        <div class="service-price">
          $${Number(serv.precio).toFixed(2)}
          <small>/ sesión</small>
        </div>
        <button class="btn btn-primary btn-sm btn-agendar-servicio" data-id="${serv.id}">
          Agendar ➜
        </button>
      </div>
    </div>
  `).join('');

  // Evento para preseleccionar servicio y saltar al wizard
  container.querySelectorAll('.btn-agendar-servicio').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      const serv = state.servicios.find(s => s.id === id);
      if (serv) {
        resetWizard();
        state.wizard.selectedService = serv;
        navigateView('wizard');
        irAPasoWizard(2);
      }
    });
  });
}

// ============================================================================
// 3. WIZARD INTERACTIVO DE AGENDAMIENTO (PASO A PASO)
// ============================================================================
function setupWizard() {
  const btnPrev = document.getElementById('btn-wizard-prev');
  const btnNext = document.getElementById('btn-wizard-next');

  btnPrev.addEventListener('click', () => {
    if (state.wizard.step > 1) {
      irAPasoWizard(state.wizard.step - 1);
    }
  });

  btnNext.addEventListener('click', async () => {
    const isValid = validarPasoActual(state.wizard.step);
    if (!isValid) return;

    if (state.wizard.step < 5) {
      irAPasoWizard(state.wizard.step + 1);
    } else {
      // Paso 5: Enviar cita a Spring Boot
      await ejecutarAgendamiento();
    }
  });

  // Selector de horarios
  const timeSlotButtons = document.querySelectorAll('#booking-time-slots .time-slot-btn');
  timeSlotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      timeSlotButtons.forEach(b => b.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      const timeVal = e.currentTarget.getAttribute('data-time');
      state.wizard.selectedTime = timeVal;
      document.getElementById('booking-time-select').value = timeVal;
    });
  });

  document.getElementById('booking-time-select')?.addEventListener('change', (e) => {
    state.wizard.selectedTime = e.target.value;
  });

  // Fecha por defecto: Mañana
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
    state.wizard.selectedDate = dateInput.value;

    dateInput.addEventListener('change', (e) => {
      state.wizard.selectedDate = e.target.value;
    });
  }

  // Tabs de paciente: Existente vs Nuevo
  const tabExisting = document.getElementById('tab-patient-existing');
  const tabNew = document.getElementById('tab-patient-new');
  const panelExisting = document.getElementById('patient-existing-panel');
  const panelNew = document.getElementById('patient-new-panel');

  tabExisting?.addEventListener('click', () => {
    tabExisting.classList.add('active');
    tabNew.classList.remove('active');
    panelExisting.style.display = 'block';
    panelNew.style.display = 'none';
  });

  tabNew?.addEventListener('click', () => {
    tabNew.classList.add('active');
    tabExisting.classList.remove('active');
    panelNew.style.display = 'block';
    panelExisting.style.display = 'none';
  });

  // Select de paciente existente
  const clientSelect = document.getElementById('booking-client-select');
  clientSelect?.addEventListener('change', (e) => {
    const clientId = Number(e.target.value);
    const client = state.clientes.find(c => c.id === clientId);
    state.wizard.selectedClient = client || null;

    const preview = document.getElementById('patient-selected-preview');
    if (client) {
      document.getElementById('preview-client-name').textContent = client.nombre;
      document.getElementById('preview-client-contact').textContent = `Email: ${client.email} | Tel: ${client.telefono || 'Sin teléfono'}`;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  });

  // Guardar nuevo paciente dentro del wizard
  document.getElementById('btn-save-new-patient')?.addEventListener('click', async () => {
    const nombre = document.getElementById('new-client-name').value.trim();
    const email = document.getElementById('new-client-email').value.trim();
    const telefono = document.getElementById('new-client-phone').value.trim();

    if (!nombre || !email) {
      mostrarToast('Por favor completa nombre y correo electrónico', 'error');
      return;
    }

    try {
      const nuevoCliente = await apiClientes.crear({ nombre, email, telefono });
      mostrarToast(`¡Paciente ${nuevoCliente.nombre} registrado con éxito!`, 'success');
      state.clientes.push(nuevoCliente);
      poblarSelectoresWizard();

      // Auto-seleccionar
      state.wizard.selectedClient = nuevoCliente;
      tabExisting.click();
      clientSelect.value = nuevoCliente.id;
      clientSelect.dispatchEvent(new Event('change'));
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  });
}

function resetWizard() {
  state.wizard = {
    step: 1,
    selectedService: null,
    selectedProfessional: null,
    selectedDate: document.getElementById('booking-date')?.value || '',
    selectedTime: '10:00',
    motivo: '',
    selectedClient: null
  };
  irAPasoWizard(1);
  poblarSelectoresWizard();
}

function irAPasoWizard(stepNumber) {
  state.wizard.step = stepNumber;

  // Actualizar indicadores del stepper
  document.querySelectorAll('.stepper-step').forEach(stepEl => {
    const s = Number(stepEl.getAttribute('data-step'));
    if (s === stepNumber) {
      stepEl.classList.add('active');
      stepEl.classList.remove('completed');
    } else if (s < stepNumber) {
      stepEl.classList.remove('active');
      stepEl.classList.add('completed');
    } else {
      stepEl.classList.remove('active', 'completed');
    }
  });

  // Mostrar el contenido del paso
  document.querySelectorAll('.wizard-step-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`wizard-step-${stepNumber}`)?.classList.add('active');

  // Botones footer
  const btnPrev = document.getElementById('btn-wizard-prev');
  const btnNext = document.getElementById('btn-wizard-next');

  btnPrev.style.visibility = stepNumber === 1 ? 'hidden' : 'visible';
  btnNext.textContent = stepNumber === 5 ? 'Confirmar y Agendar Cita 🚀' : 'Siguiente →';

  // Si llegamos al paso 5, actualizar el ticket de resumen
  if (stepNumber === 5) {
    actualizarTicketResumen();
  }
}

function validarPasoActual(step) {
  if (step === 1) {
    if (!state.wizard.selectedService) {
      mostrarToast('Por favor selecciona un servicio médico para continuar', 'error');
      return false;
    }
  } else if (step === 2) {
    if (!state.wizard.selectedProfessional) {
      mostrarToast('Por favor selecciona un especialista médico', 'error');
      return false;
    }
  } else if (step === 3) {
    const fecha = document.getElementById('booking-date').value;
    const hora = document.getElementById('booking-time-select').value;
    const motivo = document.getElementById('booking-motivo').value.trim();

    if (!fecha || !hora) {
      mostrarToast('Debes seleccionar fecha y hora', 'error');
      return false;
    }
    if (!motivo) {
      mostrarToast('Por favor indica brevemente el motivo de la consulta', 'error');
      return false;
    }

    state.wizard.selectedDate = fecha;
    state.wizard.selectedTime = hora;
    state.wizard.motivo = motivo;
  } else if (step === 4) {
    if (!state.wizard.selectedClient) {
      mostrarToast('Debes seleccionar o registrar un paciente', 'error');
      return false;
    }
  }
  return true;
}

function actualizarTicketResumen() {
  const w = state.wizard;
  document.getElementById('summary-service-name').textContent = w.selectedService?.nombre || '--';
  document.getElementById('summary-prof-name').textContent = `${w.selectedProfessional?.nombre} (${w.selectedProfessional?.especialidad})`;
  document.getElementById('summary-datetime').textContent = `${formatearFecha(w.selectedDate)} a las ${w.selectedTime}`;
  document.getElementById('summary-patient-name').textContent = `${w.selectedClient?.nombre} (${w.selectedClient?.email})`;
  document.getElementById('summary-motivo').textContent = w.motivo || '--';
  document.getElementById('summary-total-price').textContent = `$${Number(w.selectedService?.precio || 0).toFixed(2)}`;
}

function poblarSelectoresWizard() {
  // 1. Grid de servicios en el wizard
  const servContainer = document.getElementById('wizard-services-list');
  if (servContainer) {
    servContainer.innerHTML = state.servicios.map(s => `
      <div class="selectable-card ${state.wizard.selectedService?.id === s.id ? 'selected' : ''}" data-service-id="${s.id}">
        <div class="card-avatar">🩺</div>
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.25rem;">${escapeHtml(s.nombre)}</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">${escapeHtml(s.descripcion || '')}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; font-weight: 600;">
          <span style="color: var(--primary);">$${Number(s.precio).toFixed(2)}</span>
          <span style="color: var(--text-muted);">⏱️ ${s.duracionMinutos} min</span>
        </div>
      </div>
    `).join('');

    servContainer.querySelectorAll('.selectable-card').forEach(card => {
      card.addEventListener('click', (e) => {
        servContainer.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const id = Number(card.getAttribute('data-service-id'));
        state.wizard.selectedService = state.servicios.find(s => s.id === id);
      });
    });
  }

  // 2. Grid de profesionales en el wizard
  const profContainer = document.getElementById('wizard-prof-list');
  if (profContainer) {
    profContainer.innerHTML = state.profesionales.map(p => `
      <div class="selectable-card ${state.wizard.selectedProfessional?.id === p.id ? 'selected' : ''}" data-prof-id="${p.id}">
        <div class="card-avatar">👨‍⚕️</div>
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.25rem;">${escapeHtml(p.nombre)}</h4>
        <p style="font-size: 0.82rem; color: var(--secondary); font-weight: 600; margin-bottom: 0.35rem;">${escapeHtml(p.especialidad)}</p>
        <p style="font-size: 0.75rem; color: var(--text-muted);">✉️ ${escapeHtml(p.email)}</p>
      </div>
    `).join('');

    profContainer.querySelectorAll('.selectable-card').forEach(card => {
      card.addEventListener('click', (e) => {
        profContainer.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const id = Number(card.getAttribute('data-prof-id'));
        state.wizard.selectedProfessional = state.profesionales.find(p => p.id === id);
      });
    });
  }

  // 3. Select de clientes
  const clientSelect = document.getElementById('booking-client-select');
  if (clientSelect) {
    clientSelect.innerHTML = '<option value="">-- Elige un paciente registrado --</option>' +
      state.clientes.map(c => `<option value="${c.id}">${escapeHtml(c.nombre)} (${c.email})</option>`).join('');
  }
}

async function ejecutarAgendamiento() {
  const w = state.wizard;
  // Construir fecha en formato ISO (YYYY-MM-DDTHH:mm:ss)
  const fechaHoraIso = `${w.selectedDate}T${w.selectedTime}:00`;

  const requestBody = {
    clienteId: w.selectedClient.id,
    profesionalId: w.selectedProfessional.id,
    servicioId: w.selectedService.id,
    fechaHora: fechaHoraIso,
    motivo: w.motivo,
    estado: 'PENDIENTE'
  };

  try {
    const btnNext = document.getElementById('btn-wizard-next');
    btnNext.disabled = true;
    btnNext.textContent = 'Agendando turno...';

    const nuevaCita = await apiCitas.agendar(requestBody);
    mostrarToast('¡Cita agendada exitosamente!', 'success');

    // Actualizar datos
    state.citas.unshift(nuevaCita);
    actualizarEstadisticasLanding();

    // Mostrar modal de éxito
    mostrarModalCitaExitosa(nuevaCita);
  } catch (error) {
    mostrarToast(error.message, 'error');
  } finally {
    const btnNext = document.getElementById('btn-wizard-next');
    btnNext.disabled = false;
    btnNext.textContent = 'Confirmar y Agendar Cita 🚀';
  }
}

function mostrarModalCitaExitosa(cita) {
  const modal = document.getElementById('modal-cita-exitosa');
  const detallesEl = document.getElementById('modal-exitosa-detalles');
  const montoEl = document.getElementById('exitosa-monto');

  const monto = cita.servicio?.precio || state.wizard.selectedService?.precio || 0;
  montoEl.textContent = Number(monto).toFixed(2);

  detallesEl.innerHTML = `
    Cita <strong>#${cita.id}</strong> para <strong>${escapeHtml(cita.cliente?.nombre || '')}</strong> con <strong>${escapeHtml(cita.profesional?.nombre || '')}</strong>.<br />
    Fecha: <strong>${formatearFechaHora(cita.fechaHora)}</strong>.
  `;

  modal.classList.add('active');

  document.getElementById('btn-exitosa-pagar').onclick = () => {
    modal.classList.remove('active');
    abrirModalPagoParaCita(cita.id, monto, `${cita.servicio?.nombre || 'Consulta'} - ${cita.cliente?.nombre || ''}`);
  };

  document.getElementById('btn-exitosa-ver-agenda').onclick = () => {
    modal.classList.remove('active');
    navigateView('agenda');
  };
}

// ============================================================================
// 4. TABLERO DE CITAS (AGENDA & FILTROS)
// ============================================================================
function setupAgendaControls() {
  // Filtros por estado
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      filterPills.forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.agendaFilter = e.currentTarget.getAttribute('data-filter');
      renderAgendaCitas();
    });
  });

  // Buscador de citas
  const searchInput = document.getElementById('input-search-citas');
  searchInput?.addEventListener('input', (e) => {
    state.agendaSearch = e.target.value.toLowerCase().trim();
    renderAgendaCitas();
  });
}

function renderAgendaCitas() {
  const container = document.getElementById('citas-cards-container');
  if (!container) return;

  let filtradas = [...state.citas];

  // Filtro de estado
  if (state.agendaFilter !== 'TODAS') {
    filtradas = filtradas.filter(c => (c.estado || 'PENDIENTE').toUpperCase() === state.agendaFilter);
  }

  // Filtro de búsqueda
  if (state.agendaSearch) {
    filtradas = filtradas.filter(c => {
      const cliente = c.cliente?.nombre?.toLowerCase() || '';
      const prof = c.profesional?.nombre?.toLowerCase() || '';
      const serv = c.servicio?.nombre?.toLowerCase() || '';
      const motivo = c.motivo?.toLowerCase() || '';
      return cliente.includes(state.agendaSearch) ||
             prof.includes(state.agendaSearch) ||
             serv.includes(state.agendaSearch) ||
             motivo.includes(state.agendaSearch);
    });
  }

  if (filtradas.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1rem;">No se encontraron citas con los filtros seleccionados.</p>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('btn-agenda-new-booking').click()">+ Agendar Nueva Cita</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtradas.map(cita => {
    const estado = (cita.estado || 'PENDIENTE').toUpperCase();
    const tienePago = Boolean(cita.pago);
    const precio = cita.servicio?.precio || 0;

    let estadoClase = 'pendiente';
    if (estado === 'CONFIRMADA') estadoClase = 'confirmada';
    else if (estado === 'COMPLETADA') estadoClase = 'completada';
    else if (estado === 'CANCELADA') estadoClase = 'cancelada';

    return `
      <div class="cita-card">
        <div>
          <div class="cita-header">
            <span class="cita-id">CITA #${cita.id}</span>
            <span class="status-badge ${estadoClase}">${estado}</span>
          </div>

          <div class="cita-body">
            <h3 class="cita-service-name">${escapeHtml(cita.servicio?.nombre || 'Consulta General')}</h3>
            
            <div class="cita-meta-item">
              <span>📅</span>
              <strong>${formatearFechaHora(cita.fechaHora)}</strong>
            </div>

            <div class="cita-meta-item">
              <span>👤</span>
              <span>Paciente: <strong>${escapeHtml(cita.cliente?.nombre || 'Desconocido')}</strong> (${escapeHtml(cita.cliente?.telefono || 'Sin tel')})</span>
            </div>

            <div class="cita-meta-item">
              <span>👨‍⚕️</span>
              <span>Especialista: <strong>${escapeHtml(cita.profesional?.nombre || 'Asignado')}</strong> (${escapeHtml(cita.profesional?.especialidad || '')})</span>
            </div>

            ${cita.motivo ? `<div class="cita-motivo">"${escapeHtml(cita.motivo)}"</div>` : ''}

            <div class="cita-payment-info ${tienePago ? 'paid' : 'unpaid'}">
              <span>${tienePago ? `✅ Pagado ($${Number(cita.pago.monto).toFixed(2)} - ${cita.pago.metodoPago})` : `⏳ Pendiente de Pago ($${Number(precio).toFixed(2)})`}</span>
              ${!tienePago && estado !== 'CANCELADA' ? `
                <button class="btn btn-success btn-sm btn-pagar-cita" data-id="${cita.id}" data-monto="${precio}" data-desc="${escapeHtml(cita.servicio?.nombre || '')} - ${escapeHtml(cita.cliente?.nombre || '')}">
                  💳 Pagar
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="cita-actions">
          ${estado === 'PENDIENTE' ? `
            <button class="btn btn-secondary btn-sm btn-cambiar-estado" data-id="${cita.id}" data-estado="CONFIRMADA">
              ✔️ Confirmar
            </button>
          ` : ''}

          ${estado === 'CONFIRMADA' ? `
            <button class="btn btn-success btn-sm btn-cambiar-estado" data-id="${cita.id}" data-estado="COMPLETADA">
              🎉 Completar
            </button>
          ` : ''}

          ${estado !== 'CANCELADA' && estado !== 'COMPLETADA' ? `
            <button class="btn btn-danger btn-sm btn-cambiar-estado" data-id="${cita.id}" data-estado="CANCELADA">
              ✕ Cancelar
            </button>
          ` : ''}

          <button class="btn btn-secondary btn-sm btn-eliminar-cita" data-id="${cita.id}" title="Eliminar registro de cita">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Eventos de botones en tarjetas
  container.querySelectorAll('.btn-pagar-cita').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      const monto = Number(e.currentTarget.getAttribute('data-monto'));
      const desc = e.currentTarget.getAttribute('data-desc');
      abrirModalPagoParaCita(id, monto, desc);
    });
  });

  container.querySelectorAll('.btn-cambiar-estado').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      const nuevoEstado = e.currentTarget.getAttribute('data-estado');
      await cambiarEstadoCita(id, nuevoEstado);
    });
  });

  container.querySelectorAll('.btn-eliminar-cita').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      if (confirm(`¿Estás seguro de eliminar permanentemente la Cita #${id}?`)) {
        await eliminarCita(id);
      }
    });
  });
}

async function cambiarEstadoCita(id, nuevoEstado) {
  const cita = state.citas.find(c => c.id === id);
  if (!cita) return;

  const updateBody = {
    clienteId: cita.cliente?.id,
    profesionalId: cita.profesional?.id,
    servicioId: cita.servicio?.id,
    fechaHora: cita.fechaHora,
    motivo: cita.motivo,
    estado: nuevoEstado
  };

  try {
    const actualizada = await apiCitas.actualizar(id, updateBody);
    mostrarToast(`Cita #${id} actualizada a ${nuevoEstado}`, 'success');
    
    // Actualizar estado local
    const idx = state.citas.findIndex(c => c.id === id);
    if (idx !== -1) {
      state.citas[idx] = actualizada;
    }
    renderAgendaCitas();
  } catch (err) {
    mostrarToast(err.message, 'error');
  }
}

async function eliminarCita(id) {
  try {
    await apiCitas.eliminar(id);
    mostrarToast(`Cita #${id} eliminada`, 'success');
    state.citas = state.citas.filter(c => c.id !== id);
    renderAgendaCitas();
    actualizarEstadisticasLanding();
  } catch (err) {
    mostrarToast(err.message, 'error');
  }
}

// ============================================================================
// 5. CAJA & PAGOS (RELACIÓN 1 A 1 CON CITAS)
// ============================================================================
function setupPaymentModal() {
  const modal = document.getElementById('modal-pago');
  const btnClose = document.getElementById('btn-close-modal-pago');
  const btnCancel = document.getElementById('btn-cancel-modal-pago');
  const btnConfirm = document.getElementById('btn-confirm-modal-pago');

  const closeModal = () => modal.classList.remove('active');

  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  btnConfirm.addEventListener('click', async () => {
    const citaId = Number(document.getElementById('pago-cita-id').value);
    const monto = Number(document.getElementById('pago-monto').value);
    const metodoPago = document.getElementById('pago-metodo').value;

    try {
      btnConfirm.disabled = true;
      btnConfirm.textContent = 'Procesando...';

      const pagoRegistrado = await apiPagos.registrarPago({
        citaId,
        monto,
        metodoPago,
        fechaPago: new Date().toISOString()
      });

      mostrarToast(`¡Pago de $${monto.toFixed(2)} registrado con éxito!`, 'success');
      closeModal();

      // Recargar datos para ver la cita confirmada y el pago en historial
      await recargarTodo();
    } catch (err) {
      mostrarToast(err.message, 'error');
    } finally {
      btnConfirm.disabled = false;
      btnConfirm.textContent = '✅ Confirmar y Pagar';
    }
  });
}

function abrirModalPagoParaCita(citaId, monto, descripcion) {
  document.getElementById('pago-cita-id').value = citaId;
  document.getElementById('pago-monto').value = Number(monto).toFixed(2);
  document.getElementById('pago-cita-desc').textContent = `Cita #${citaId}: ${descripcion}`;
  document.getElementById('modal-pago').classList.add('active');
}

function renderPagosTable() {
  const tbody = document.getElementById('table-pagos-body');
  if (!tbody) return;

  const pagos = state.pagos || [];

  // Calcular métricas
  const totalRevenue = pagos.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);
  const avgTicket = pagos.length > 0 ? totalRevenue / pagos.length : 0;

  // Método más frecuente
  const methodCounts = {};
  pagos.forEach(p => {
    methodCounts[p.metodoPago] = (methodCounts[p.metodoPago] || 0) + 1;
  });
  let topMethod = '--';
  let maxCount = 0;
  for (const m in methodCounts) {
    if (methodCounts[m] > maxCount) {
      maxCount = methodCounts[m];
      topMethod = m;
    }
  }

  document.getElementById('stat-total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
  document.getElementById('stat-total-payments').textContent = pagos.length;
  document.getElementById('stat-avg-ticket').textContent = `$${avgTicket.toFixed(2)}`;
  document.getElementById('stat-top-method').textContent = topMethod;

  if (pagos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No hay pagos registrados aún en la caja.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pagos.map(p => `
    <tr>
      <td><strong>#${p.id}</strong></td>
      <td>
        <a href="#" class="link-cita-table" data-cita-id="${p.citaId}" style="color: var(--primary); font-weight: 600; text-decoration: none;">
          Cita #${p.citaId}
        </a>
      </td>
      <td style="font-weight: 700; color: var(--success);">$${Number(p.monto).toFixed(2)}</td>
      <td>
        <span class="status-badge" style="background: #f1f5f9; color: var(--text-main); border: 1px solid #cbd5e1;">
          ${escapeHtml(p.metodoPago || 'TARJETA')}
        </span>
      </td>
      <td>${formatearFechaHora(p.fechaPago)}</td>
      <td>
        <button class="btn btn-secondary btn-sm btn-eliminar-pago" data-id="${p.id}" title="Eliminar pago">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.link-cita-table').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const citaId = e.currentTarget.getAttribute('data-cita-id');
      state.agendaSearch = '';
      state.agendaFilter = 'TODAS';
      navigateView('agenda');
      document.getElementById('input-search-citas').value = citaId;
      document.getElementById('input-search-citas').dispatchEvent(new Event('input'));
    });
  });

  tbody.querySelectorAll('.btn-eliminar-pago').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      if (confirm(`¿Deseas anular el pago #${id}?`)) {
        try {
          await apiPagos.eliminar(id);
          mostrarToast(`Pago #${id} eliminado`, 'success');
          await recargarTodo();
        } catch (err) {
          mostrarToast(err.message, 'error');
        }
      }
    });
  });
}

// ============================================================================
// 6. DIRECTORIO DE ESPECIALISTAS, PACIENTES Y SERVICIOS
// ============================================================================
function setupDirectoryControls() {
  const tabProf = document.getElementById('tab-dir-profesionales');
  const tabPac = document.getElementById('tab-dir-pacientes');
  const tabServ = document.getElementById('tab-dir-servicios');

  const panelProf = document.getElementById('dir-panel-profesionales');
  const panelPac = document.getElementById('dir-panel-pacientes');
  const panelServ = document.getElementById('dir-panel-servicios');

  tabProf.addEventListener('click', () => {
    tabProf.classList.add('active');
    tabPac.classList.remove('active');
    tabServ.classList.remove('active');
    panelProf.style.display = 'block';
    panelPac.style.display = 'none';
    panelServ.style.display = 'none';
  });

  tabPac.addEventListener('click', () => {
    tabPac.classList.add('active');
    tabProf.classList.remove('active');
    tabServ.classList.remove('active');
    panelPac.style.display = 'block';
    panelProf.style.display = 'none';
    panelServ.style.display = 'none';
  });

  tabServ.addEventListener('click', () => {
    tabServ.classList.add('active');
    tabProf.classList.remove('active');
    tabPac.classList.remove('active');
    panelServ.style.display = 'block';
    panelProf.style.display = 'none';
    panelPac.style.display = 'none';
  });

  // Modal Nuevo Cliente
  const modalCli = document.getElementById('modal-nuevo-cliente');
  document.getElementById('btn-modal-open-cliente')?.addEventListener('click', () => modalCli.classList.add('active'));
  document.getElementById('btn-close-modal-cliente')?.addEventListener('click', () => modalCli.classList.remove('active'));
  document.getElementById('btn-cancel-modal-cliente')?.addEventListener('click', () => modalCli.classList.remove('active'));
  document.getElementById('btn-save-modal-cliente')?.addEventListener('click', async () => {
    const nombre = document.getElementById('modal-cliente-nombre').value.trim();
    const email = document.getElementById('modal-cliente-email').value.trim();
    const telefono = document.getElementById('modal-cliente-telefono').value.trim();

    if (!nombre || !email) {
      mostrarToast('Nombre y correo son requeridos', 'error');
      return;
    }

    try {
      await apiClientes.crear({ nombre, email, telefono });
      mostrarToast(`Paciente ${nombre} registrado`, 'success');
      modalCli.classList.remove('active');
      await recargarTodo();
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  });

  // Modal Nuevo Profesional
  const modalProf = document.getElementById('modal-nuevo-profesional');
  document.getElementById('btn-modal-open-profesional')?.addEventListener('click', () => modalProf.classList.add('active'));
  document.getElementById('btn-close-modal-profesional')?.addEventListener('click', () => modalProf.classList.remove('active'));
  document.getElementById('btn-cancel-modal-profesional')?.addEventListener('click', () => modalProf.classList.remove('active'));
  document.getElementById('btn-save-modal-profesional')?.addEventListener('click', async () => {
    const nombre = document.getElementById('modal-prof-nombre').value.trim();
    const especialidad = document.getElementById('modal-prof-especialidad').value.trim();
    const email = document.getElementById('modal-prof-email').value.trim();
    const telefono = document.getElementById('modal-prof-telefono').value.trim();

    if (!nombre || !especialidad || !email) {
      mostrarToast('Nombre, especialidad y email son requeridos', 'error');
      return;
    }

    try {
      await apiProfesionales.crear({ nombre, especialidad, email, telefono });
      mostrarToast(`Especialista ${nombre} registrado`, 'success');
      modalProf.classList.remove('active');
      await recargarTodo();
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  });

  // Modal Nuevo Servicio
  const modalServ = document.getElementById('modal-nuevo-servicio');
  document.getElementById('btn-modal-open-servicio')?.addEventListener('click', () => modalServ.classList.add('active'));
  document.getElementById('btn-close-modal-servicio')?.addEventListener('click', () => modalServ.classList.remove('active'));
  document.getElementById('btn-cancel-modal-servicio')?.addEventListener('click', () => modalServ.classList.remove('active'));
  document.getElementById('btn-save-modal-servicio')?.addEventListener('click', async () => {
    const nombre = document.getElementById('modal-serv-nombre').value.trim();
    const descripcion = document.getElementById('modal-serv-descripcion').value.trim();
    const precio = Number(document.getElementById('modal-serv-precio').value);
    const duracionMinutos = Number(document.getElementById('modal-serv-duracion').value) || 30;

    if (!nombre || isNaN(precio) || precio <= 0) {
      mostrarToast('Nombre y precio válido son requeridos', 'error');
      return;
    }

    try {
      await apiServicios.crear({ nombre, descripcion, precio, duracionMinutos });
      mostrarToast(`Servicio ${nombre} registrado`, 'success');
      modalServ.classList.remove('active');
      await recargarTodo();
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  });
}

function renderDirectorio() {
  // 1. Grid Profesionales
  const gridProf = document.getElementById('dir-grid-profesionales');
  if (gridProf) {
    gridProf.innerHTML = state.profesionales.map(p => `
      <div class="cita-card">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
          <div class="card-avatar" style="margin: 0;">👨‍⚕️</div>
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700;">${escapeHtml(p.nombre)}</h3>
            <span class="status-badge confirmada">${escapeHtml(p.especialidad)}</span>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">✉️ ${escapeHtml(p.email)}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">📞 ${escapeHtml(p.telefono || 'Sin teléfono')}</p>
        <button class="btn btn-secondary btn-sm" onclick="alert('Historial clínico del profesional #${p.id}')">Ver Agenda</button>
      </div>
    `).join('');
  }

  // 2. Grid Pacientes
  const gridPac = document.getElementById('dir-grid-pacientes');
  if (gridPac) {
    gridPac.innerHTML = state.clientes.map(c => `
      <div class="cita-card">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
          <div class="card-avatar" style="margin: 0;">👤</div>
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700;">${escapeHtml(c.nombre)}</h3>
            <span class="status-badge" style="background: #f1f5f9; color: var(--text-muted);">PACIENTE #${c.id}</span>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">✉️ ${escapeHtml(c.email)}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">📞 ${escapeHtml(c.telefono || 'Sin teléfono')}</p>
        <button class="btn btn-secondary btn-sm" onclick="alert('Historial de citas del paciente #${c.id}')">Ver Citas</button>
      </div>
    `).join('');
  }

  // 3. Grid Servicios
  const gridServ = document.getElementById('dir-grid-servicios');
  if (gridServ) {
    gridServ.innerHTML = state.servicios.map(s => `
      <div class="service-card">
        <div>
          <div class="service-header">
            <span class="service-badge">⏱️ ${s.duracionMinutos} min</span>
          </div>
          <h3 class="service-title">${escapeHtml(s.nombre)}</h3>
          <p class="service-desc">${escapeHtml(s.descripcion || '')}</p>
        </div>
        <div class="service-footer">
          <div class="service-price">$${Number(s.precio).toFixed(2)}</div>
          <button class="btn btn-secondary btn-sm" onclick="alert('Modificar servicio #${s.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }
}

// ============================================================================
// 7. LABORATORIO DE REGLAS DE NEGOCIO (PRUEBAS VISUALES EN VIVO)
// ============================================================================
function setupLabControls() {
  // Test 1: Anticipación menor a 1 hora (400)
  document.getElementById('btn-lab-regla-tiempo')?.addEventListener('click', async () => {
    const diezMinutosAtras = new Date(Date.now() - 10 * 60 * 1000).toISOString().slice(0, 19);
    try {
      await apiCitas.agendar({
        clienteId: state.clientes[0]?.id || 1,
        profesionalId: state.profesionales[0]?.id || 1,
        servicioId: state.servicios[0]?.id || 1,
        fechaHora: diezMinutosAtras,
        motivo: 'Prueba de fecha pasada',
        estado: 'PENDIENTE'
      });
    } catch (err) {
      mostrarToast(`Rechazado correctamente: ${err.message}`, 'error');
    }
  });

  // Test 2: Solapamiento de horario (400)
  document.getElementById('btn-lab-regla-solapamiento')?.addEventListener('click', async () => {
    const citaExistente = state.citas[0];
    if (!citaExistente) {
      mostrarToast('Agenda al menos una cita primero para probar el solapamiento', 'error');
      return;
    }

    try {
      await apiCitas.agendar({
        clienteId: state.clientes[0]?.id || 1,
        profesionalId: citaExistente.profesional?.id || 1,
        servicioId: citaExistente.servicio?.id || 1,
        fechaHora: citaExistente.fechaHora, // Misma fecha y hora que ya está ocupada
        motivo: 'Prueba de conflicto de agenda',
        estado: 'PENDIENTE'
      });
    } catch (err) {
      mostrarToast(`Conflicto detectado: ${err.message}`, 'error');
    }
  });

  // Test 3: Pago insuficiente (400)
  document.getElementById('btn-lab-regla-monto')?.addEventListener('click', async () => {
    const cita = state.citas[0];
    if (!cita) {
      mostrarToast('Se necesita una cita para probar el pago', 'error');
      return;
    }

    try {
      await apiPagos.registrarPago({
        citaId: cita.id,
        monto: 1.00, // Menor que cualquier servicio
        metodoPago: 'EFECTIVO'
      });
    } catch (err) {
      mostrarToast(`Validación de monto: ${err.message}`, 'error');
    }
  });

  // Test 4: Doble pago / Unicidad 1 a 1 (400)
  document.getElementById('btn-lab-regla-doble-pago')?.addEventListener('click', async () => {
    const pagoExistente = state.pagos[0];
    if (!pagoExistente) {
      mostrarToast('Registra al menos un pago primero para probar la regla de unicidad 1 a 1', 'error');
      return;
    }

    try {
      await apiPagos.registrarPago({
        citaId: pagoExistente.citaId,
        monto: pagoExistente.monto,
        metodoPago: 'TARJETA'
      });
    } catch (err) {
      mostrarToast(`Unicidad 1 a 1 respetada: ${err.message}`, 'error');
    }
  });

  // Test 5: Recurso 404
  document.getElementById('btn-lab-regla-404')?.addEventListener('click', async () => {
    try {
      await apiCitas.obtenerPorId(999999);
    } catch (err) {
      mostrarToast(`404 Capturado: ${err.message}`, 'error');
    }
  });
}

function setupHttpLogger() {
  const consoleEl = document.getElementById('lab-console-output');
  if (!consoleEl) return;

  setLogCallback(({ timestamp, method, url, body, status, result, error }) => {
    const statusColor = status >= 200 && status < 300 ? '#10b981' : (status === 404 ? '#f59e0b' : '#ef4444');
    
    consoleEl.innerHTML = `
<div style="border-bottom: 1px solid #334155; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
  <span style="color: #94a3b8;">[${timestamp}]</span> 
  <strong style="color: #60a5fa;">${method}</strong> 
  <span style="color: #cbd5e1;">${url}</span>
  ➜ <strong style="color: ${statusColor};">HTTP ${status}</strong>
</div>
${body ? `<div style="color: #94a3b8;">// Request Body:\n${escapeHtml(JSON.stringify(body, null, 2))}</div>` : ''}
<div style="color: ${statusColor}; margin-top: 0.35rem;">// Response Body:\n${escapeHtml(JSON.stringify(result || error, null, 2))}</div>
    `;
  });
}

// ============================================================================
// UTILIDADES (TOASTS, FORMATOS Y SEGURIDAD)
// ============================================================================
function mostrarToast(mensaje, tipo = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  
  let icon = 'ℹ️';
  if (tipo === 'success') icon = '✅';
  else if (tipo === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(mensaje)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function formatearFecha(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatearFechaHora(isoString) {
  if (!isoString) return '--';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

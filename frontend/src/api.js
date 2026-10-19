/**
 * ============================================================================
 * SERVICIO DE COMUNICACIÓN CON LA API REST (SPRING BOOT)
 * ============================================================================
 * 
 * Centraliza todas las llamadas HTTP a los endpoints de la API de Citas Médicas:
 * - Clientes (/api/clientes)
 * - Profesionales (/api/profesionales)
 * - Servicios (/api/servicios)
 * - Citas (/api/citas) [Relación 1 a N con Clientes]
 * - Pagos (/api/pagos) [Relación 1 a 1 con Citas]
 */

export const API_BASE = '/api';

// Callback para monitorizar peticiones HTTP en vivo en la UI
let onFetchLog = null;
export function setLogCallback(callback) {
  onFetchLog = callback;
}

function logRequest(method, url, body, status, result, error = null) {
  if (onFetchLog) {
    onFetchLog({
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      body,
      status,
      result,
      error
    });
  }
}

async function handleResponse(response, method, url, body) {
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { mensaje: text } : null;
  }

  logRequest(method, url, body, response.status, data, !response.ok ? data : null);

  if (!response.ok) {
    const errorMsg = data?.mensaje || data?.error || `Error HTTP ${response.status}: ${response.statusText}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

// ============================================================================
// 1. CLIENTES (/api/clientes)
// ============================================================================
export const apiClientes = {
  async listar() {
    const url = `${API_BASE}/clientes`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async obtenerPorId(id) {
    const url = `${API_BASE}/clientes/${id}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async buscarPorEmail(email) {
    const url = `${API_BASE}/clientes/buscar?email=${encodeURIComponent(email)}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async crear(cliente) {
    const url = `${API_BASE}/clientes`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    return handleResponse(response, 'POST', url, cliente);
  },

  async actualizar(id, cliente) {
    const url = `${API_BASE}/clientes/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    return handleResponse(response, 'PUT', url, cliente);
  },

  async eliminar(id) {
    const url = `${API_BASE}/clientes/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response, 'DELETE', url, null);
  }
};

// ============================================================================
// 2. PROFESIONALES (/api/profesionales)
// ============================================================================
export const apiProfesionales = {
  async listar() {
    const url = `${API_BASE}/profesionales`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async obtenerPorId(id) {
    const url = `${API_BASE}/profesionales/${id}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async buscarPorEspecialidad(especialidad) {
    const url = `${API_BASE}/profesionales/especialidad/${encodeURIComponent(especialidad)}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async crear(profesional) {
    const url = `${API_BASE}/profesionales`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profesional)
    });
    return handleResponse(response, 'POST', url, profesional);
  },

  async actualizar(id, profesional) {
    const url = `${API_BASE}/profesionales/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profesional)
    });
    return handleResponse(response, 'PUT', url, profesional);
  },

  async eliminar(id) {
    const url = `${API_BASE}/profesionales/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response, 'DELETE', url, null);
  }
};

// ============================================================================
// 3. SERVICIOS (/api/servicios)
// ============================================================================
export const apiServicios = {
  async listar() {
    const url = `${API_BASE}/servicios`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async obtenerPorId(id) {
    const url = `${API_BASE}/servicios/${id}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async crear(servicio) {
    const url = `${API_BASE}/servicios`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio)
    });
    return handleResponse(response, 'POST', url, servicio);
  },

  async actualizar(id, servicio) {
    const url = `${API_BASE}/servicios/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio)
    });
    return handleResponse(response, 'PUT', url, servicio);
  },

  async eliminar(id) {
    const url = `${API_BASE}/servicios/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response, 'DELETE', url, null);
  }
};

// ============================================================================
// 4. CITAS (/api/citas)
// ============================================================================
export const apiCitas = {
  async listar() {
    const url = `${API_BASE}/citas`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async obtenerPorId(id) {
    const url = `${API_BASE}/citas/${id}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async obtenerPorCliente(clienteId) {
    const url = `${API_BASE}/citas/cliente/${clienteId}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async agendar(citaData) {
    const url = `${API_BASE}/citas`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(citaData)
    });
    return handleResponse(response, 'POST', url, citaData);
  },

  async actualizar(id, citaData) {
    const url = `${API_BASE}/citas/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(citaData)
    });
    return handleResponse(response, 'PUT', url, citaData);
  },

  async eliminar(id) {
    const url = `${API_BASE}/citas/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response, 'DELETE', url, null);
  }
};

// ============================================================================
// 5. PAGOS (/api/pagos)
// ============================================================================
export const apiPagos = {
  async listar() {
    const url = `${API_BASE}/pagos`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async obtenerPorId(id) {
    const url = `${API_BASE}/pagos/${id}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async obtenerPorCitaId(citaId) {
    const url = `${API_BASE}/pagos/cita/${citaId}`;
    const response = await fetch(url);
    return handleResponse(response, 'GET', url, null);
  },

  async registrarPago(pagoData) {
    const url = `${API_BASE}/pagos`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pagoData)
    });
    return handleResponse(response, 'POST', url, pagoData);
  },

  async eliminar(id) {
    const url = `${API_BASE}/pagos/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response, 'DELETE', url, null);
  }
};

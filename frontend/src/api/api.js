// MediCitas Pro - API Client
// Centralized HTTP client consuming all Spring Boot endpoints

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || '/api';

export const getApiBaseUrl = () => {
  return localStorage.getItem('medicitas_api_url') || DEFAULT_API_URL;
};

export const setApiBaseUrl = (url) => {
  if (url) {
    localStorage.setItem('medicitas_api_url', url.replace(/\/+$/, ''));
  } else {
    localStorage.removeItem('medicitas_api_url');
  }
};

async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = 'Ha ocurrido un error en la solicitud';
      if (typeof data === 'object' && data !== null) {
        errorMessage = data.mensaje || data.error || data.message || JSON.stringify(data);
      } else if (typeof data === 'string' && data.trim()) {
        errorMessage = data;
      }
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const connErr = new Error('No se pudo conectar con el servidor Spring Boot (http://localhost:8080). Asegúrate de que el backend esté ejecutándose.');
      connErr.isConnectionError = true;
      throw connErr;
    }
    throw error;
  }
}

// -------------------------------------------------------------
// CITAS API (/api/citas)
// -------------------------------------------------------------
export const citasApi = {
  getAll: () => request('/citas'),
  getById: (id) => request(`/citas/${id}`),
  getByCliente: (clienteId) => request(`/citas/cliente/${clienteId}`),
  create: (data) =>
    request('/citas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/citas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/citas/${id}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// CLIENTES API (/api/clientes)
// -------------------------------------------------------------
export const clientesApi = {
  getAll: () => request('/clientes'),
  getById: (id) => request(`/clientes/${id}`),
  create: (data) =>
    request('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/clientes/${id}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// PROFESIONALES API (/api/profesionales)
// -------------------------------------------------------------
export const profesionalesApi = {
  getAll: () => request('/profesionales'),
  getById: (id) => request(`/profesionales/${id}`),
  create: (data) =>
    request('/profesionales', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/profesionales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/profesionales/${id}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// SERVICIOS API (/api/servicios)
// -------------------------------------------------------------
export const serviciosApi = {
  getAll: () => request('/servicios'),
  getById: (id) => request(`/servicios/${id}`),
  create: (data) =>
    request('/servicios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/servicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/servicios/${id}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// PAGOS API (/api/pagos)
// -------------------------------------------------------------
export const pagosApi = {
  getAll: () => request('/pagos'),
  getById: (id) => request(`/pagos/${id}`),
  getByCitaId: (citaId) => request(`/pagos/cita/${citaId}`),
  create: (data) =>
    request('/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/pagos/${id}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
export const healthApi = {
  check: async () => {
    try {
      await request('/citas');
      return { online: true };
    } catch (err) {
      return { online: false, error: err.message };
    }
  },
};

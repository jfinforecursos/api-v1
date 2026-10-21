import React, { useState } from 'react';
import {
  FileCode2,
  ExternalLink,
  Server,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { getApiBaseUrl } from '../api/api';

export default function ApiDocsView() {
  const [activeTest, setActiveTest] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const endpoints = [
    {
      group: 'Citas (/api/citas)',
      items: [
        { method: 'GET', path: '/citas', desc: 'Obtener todas las citas agendadas' },
        { method: 'GET', path: '/citas/{id}', desc: 'Obtener detalles de una cita por ID' },
        { method: 'GET', path: '/citas/cliente/{clienteId}', desc: 'Consultar citas de un cliente (Relación 1 a N)' },
        { method: 'POST', path: '/citas', desc: 'Agendar nueva cita médica' },
        { method: 'PUT', path: '/citas/{id}', desc: 'Actualizar o reprogramar una cita existente' },
        { method: 'DELETE', path: '/citas/{id}', desc: 'Eliminar o cancelar una cita por ID' },
      ],
    },
    {
      group: 'Clientes (/api/clientes)',
      items: [
        { method: 'GET', path: '/clientes', desc: 'Listar todos los pacientes registrados' },
        { method: 'GET', path: '/clientes/{id}', desc: 'Obtener paciente por ID' },
        { method: 'POST', path: '/clientes', desc: 'Registrar nuevo paciente' },
        { method: 'PUT', path: '/clientes/{id}', desc: 'Actualizar datos de paciente' },
        { method: 'DELETE', path: '/clientes/{id}', desc: 'Eliminar paciente por ID' },
      ],
    },
    {
      group: 'Profesionales (/api/profesionales)',
      items: [
        { method: 'GET', path: '/profesionales', desc: 'Listar especialistas médicos' },
        { method: 'GET', path: '/profesionales/{id}', desc: 'Obtener especialista por ID' },
        { method: 'POST', path: '/profesionales', desc: 'Registrar nuevo especialista médico' },
        { method: 'PUT', path: '/profesionales/{id}', desc: 'Actualizar especialista' },
        { method: 'DELETE', path: '/profesionales/{id}', desc: 'Eliminar especialista por ID' },
      ],
    },
    {
      group: 'Servicios (/api/servicios)',
      items: [
        { method: 'GET', path: '/servicios', desc: 'Listar catálogo de servicios y aranceles' },
        { method: 'GET', path: '/servicios/{id}', desc: 'Obtener servicio por ID' },
        { method: 'POST', path: '/servicios', desc: 'Crear nuevo procedimiento médico' },
        { method: 'PUT', path: '/servicios/{id}', desc: 'Actualizar servicio' },
        { method: 'DELETE', path: '/servicios/{id}', desc: 'Eliminar servicio por ID' },
      ],
    },
    {
      group: 'Pagos (/api/pagos)',
      items: [
        { method: 'GET', path: '/pagos', desc: 'Listar todos los comprobantes de pago' },
        { method: 'GET', path: '/pagos/{id}', desc: 'Buscar pago por su ID' },
        { method: 'GET', path: '/pagos/cita/{citaId}', desc: 'Consultar pago asociado a una cita (1 a 1)' },
        { method: 'POST', path: '/pagos', desc: 'Registrar pago único para una cita' },
        { method: 'DELETE', path: '/pagos/{id}', desc: 'Eliminar comprobante de pago por ID' },
      ],
    },
  ];

  const handleTestGet = async (path) => {
    // only test parameterless GET paths
    if (path.includes('{')) return;
    setIsLoadingTest(true);
    setActiveTest(path);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}${path}`);
      const data = await res.json();
      setTestResult({
        status: res.status,
        ok: res.ok,
        data,
      });
    } catch (err) {
      setTestResult({
        status: 0,
        ok: false,
        error: err.message,
      });
    } finally {
      setIsLoadingTest(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
          Documentación OpenAPI y Referencia de la API
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
          Especificación completa del contrato REST implementado en Spring Boot con SpringDoc y Scalar
        </p>
      </div>

      {/* Quick External Links Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <a
          href="http://localhost:8080/scalar"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel card-interactive"
          style={{ padding: '1.4rem', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
              Interfaz Moderna
            </span>
            <ExternalLink size={16} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Scalar API Reference
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
            UI de última generación con ejemplos listos para copiar en fetch, cURL, Python y Axios.
          </p>
        </a>

        <a
          href="http://localhost:8080/swagger-ui.html"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel card-interactive"
          style={{ padding: '1.4rem', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
              Estándar OpenAPI
            </span>
            <ExternalLink size={16} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Swagger UI
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
            Explorador interactivo tradicional de SpringDoc con ejecución directa de requests.
          </p>
        </a>

        <a
          href="http://localhost:8080/v3/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel card-interactive"
          style={{ padding: '1.4rem', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
              JSON Spec
            </span>
            <ExternalLink size={16} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            OpenAPI 3.0 Raw Spec
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
            Definición JSON en crudo para importar en Postman, Insomnia o generadores de SDK.
          </p>
        </a>
      </div>

      {/* Live Interactive Quick Tester (if active) */}
      {testResult && (
        <div className="glass-panel" style={{ padding: '1.5rem', borderColor: testResult.ok ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {testResult.ok ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#f43f5e" />}
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                Respuesta en Vivo: <code>GET {activeTest}</code>
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: testResult.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                  color: testResult.ok ? '#34d399' : '#fb7185',
                }}
              >
                Status: {testResult.status}
              </span>
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="btn btn-ghost btn-sm"
            >
              Cerrar Consola
            </button>
          </div>
          <pre
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: '#060a12',
              color: '#38bdf8',
              fontSize: '0.82rem',
              overflowX: 'auto',
              maxHeight: '260px',
            }}
          >
            {JSON.stringify(testResult.data || testResult.error, null, 2)}
          </pre>
        </div>
      )}

      {/* Endpoints Directory */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {endpoints.map((group, gIdx) => (
          <div key={group.group} className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              {group.group}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {group.items.map((item, iIdx) => {
                const uniqueKey = `${gIdx}-${iIdx}`;
                const canTest = item.method === 'GET' && !item.path.includes('{');

                const methodColors = {
                  GET: { bg: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', border: 'rgba(6, 182, 212, 0.3)' },
                  POST: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
                  PUT: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
                  DELETE: { bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' },
                };

                const style = methodColors[item.method] || methodColors.GET;

                return (
                  <div
                    key={item.path + item.method}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: style.bg,
                          color: style.color,
                          border: `1px solid ${style.border}`,
                          minWidth: '55px',
                          textAlign: 'center',
                        }}
                      >
                        {item.method}
                      </span>
                      <code style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {item.path}
                      </code>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        — {item.desc}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {canTest && (
                        <button
                          onClick={() => handleTestGet(item.path)}
                          disabled={isLoadingTest}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <Play size={11} color="#38bdf8" />
                          <span>Probar GET</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(`http://localhost:8080/api${item.path}`, uniqueKey)}
                        className="btn-icon btn-ghost"
                        style={{ width: '28px', height: '28px' }}
                        title="Copiar URL completa"
                      >
                        {copiedIndex === uniqueKey ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

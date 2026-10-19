package com.example.citas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.citas.dto.CitaRequestDTO;
import com.example.citas.dto.CitaResponseDTO;
import com.example.citas.dto.PagoResponseDTO;
import com.example.citas.exception.RecursoNoEncontradoException;
import com.example.citas.exception.ReglaDeNegocioException;
import com.example.citas.model.entity.Cita;
import com.example.citas.model.entity.Cliente;
import com.example.citas.model.entity.Profesional;
import com.example.citas.model.entity.Servicio;
import com.example.citas.repository.CitaRepository;
import com.example.citas.repository.ClienteRepository;
import com.example.citas.repository.ProfesionalRepository;
import com.example.citas.repository.ServicioRepository;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final ClienteRepository clienteRepository;
    private final ProfesionalRepository profesionalRepository;
    private final ServicioRepository servicioRepository;

    private final ClienteService clienteService;
    private final ProfesionalService profesionalService;
    private final ServicioService servicioService;

    public CitaService(
            CitaRepository citaRepository,
            ClienteRepository clienteRepository,
            ProfesionalRepository profesionalRepository,
            ServicioRepository servicioRepository,
            ClienteService clienteService,
            ProfesionalService profesionalService,
            ServicioService servicioService) {
        this.citaRepository = citaRepository;
        this.clienteRepository = clienteRepository;
        this.profesionalRepository = profesionalRepository;
        this.servicioRepository = servicioRepository;
        this.clienteService = clienteService;
        this.profesionalService = profesionalService;
        this.servicioService = servicioService;
    }

    public List<CitaResponseDTO> obtenerTodas() {
        return citaRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public CitaResponseDTO obtenerPorId(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada con id: " + id));
        return convertirADTO(cita);
    }

    // Consulta para aprovechar la relación Uno a Muchos (Cliente 1 : N Citas)
    public List<CitaResponseDTO> obtenerPorCliente(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new RecursoNoEncontradoException("Cliente no encontrado con id: " + clienteId);
        }
        return citaRepository.findByClienteId(clienteId)
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public CitaResponseDTO agendar(CitaRequestDTO dto) {
        validarCamposObligatorios(dto);

        // REGLA DE NEGOCIO 1: La cita debe agendarse a futuro con al menos 1 hora de anticipación
        if (dto.fechaHora().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new ReglaDeNegocioException("La cita debe agendarse con al menos 1 hora de anticipación en una fecha y hora futura");
        }

        // REGLA DE NEGOCIO 2: El profesional no puede tener dos citas en el mismo horario (conflicto de agenda)
        if (citaRepository.existsByProfesionalIdAndFechaHora(dto.profesionalId(), dto.fechaHora())) {
            throw new ReglaDeNegocioException("El profesional seleccionado ya cuenta con una cita agendada para la fecha y hora indicada");
        }

        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con id: " + dto.clienteId()));

        Profesional profesional = profesionalRepository.findById(dto.profesionalId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Profesional no encontrado con id: " + dto.profesionalId()));

        Servicio servicio = servicioRepository.findById(dto.servicioId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Servicio no encontrado con id: " + dto.servicioId()));

        String estado = (dto.estado() != null && !dto.estado().isBlank()) ? dto.estado().toUpperCase() : "PENDIENTE";

        Cita cita = new Cita(null, cliente, profesional, servicio, dto.fechaHora(), dto.motivo(), estado);
        Cita guardada = citaRepository.save(cita);
        return convertirADTO(guardada);
    }

    public CitaResponseDTO actualizar(Long id, CitaRequestDTO dto) {
        validarCamposObligatorios(dto);

        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada con id: " + id));

        // REGLA DE NEGOCIO 1 (al actualizar horario): La nueva fecha debe ser a futuro
        if (dto.fechaHora().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new ReglaDeNegocioException("La nueva fecha y hora debe tener al menos 1 hora de anticipación");
        }

        // REGLA DE NEGOCIO 2 (al actualizar horario): Verificar disponibilidad del profesional si cambia la fecha u hora
        if (!cita.getFechaHora().isEqual(dto.fechaHora()) &&
                citaRepository.existsByProfesionalIdAndFechaHora(dto.profesionalId(), dto.fechaHora())) {
            throw new ReglaDeNegocioException("El profesional seleccionado ya cuenta con una cita agendada para el nuevo horario");
        }

        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con id: " + dto.clienteId()));

        Profesional profesional = profesionalRepository.findById(dto.profesionalId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Profesional no encontrado con id: " + dto.profesionalId()));

        Servicio servicio = servicioRepository.findById(dto.servicioId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Servicio no encontrado con id: " + dto.servicioId()));

        cita.setCliente(cliente);
        cita.setProfesional(profesional);
        cita.setServicio(servicio);
        cita.setFechaHora(dto.fechaHora());
        cita.setMotivo(dto.motivo());
        if (dto.estado() != null && !dto.estado().isBlank()) {
            cita.setEstado(dto.estado().toUpperCase());
        }

        Cita actualizada = citaRepository.save(cita);
        return convertirADTO(actualizada);
    }

    public void eliminar(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada con id: " + id));

        // REGLA DE NEGOCIO 3: No se permite eliminar una cita que ya fue pagada
        if (cita.getPago() != null) {
            throw new ReglaDeNegocioException("No se puede eliminar la cita porque ya tiene un pago registrado. Debe tramitarse una anulación de pago previa");
        }

        citaRepository.delete(cita);
    }

    private void validarCamposObligatorios(CitaRequestDTO dto) {
        if (dto.clienteId() == null) {
            throw new ReglaDeNegocioException("El id del cliente es obligatorio");
        }
        if (dto.profesionalId() == null) {
            throw new ReglaDeNegocioException("El id del profesional es obligatorio");
        }
        if (dto.servicioId() == null) {
            throw new ReglaDeNegocioException("El id del servicio es obligatorio");
        }
        if (dto.fechaHora() == null) {
            throw new ReglaDeNegocioException("La fecha y hora de la cita son obligatorias");
        }
    }

    private CitaResponseDTO convertirADTO(Cita cita) {
        PagoResponseDTO pagoDTO = null;
        if (cita.getPago() != null) {
            pagoDTO = new PagoResponseDTO(
                    cita.getPago().getId(),
                    cita.getId(),
                    cita.getPago().getMonto(),
                    cita.getPago().getMetodoPago() != null ? cita.getPago().getMetodoPago().name() : null,
                    cita.getPago().getFechaPago()
            );
        }

        return new CitaResponseDTO(
                cita.getId(),
                clienteService.convertirADTO(cita.getCliente()),
                profesionalService.convertirADTO(cita.getProfesional()),
                servicioService.convertirADTO(cita.getServicio()),
                cita.getFechaHora(),
                cita.getMotivo(),
                cita.getEstado() != null ? cita.getEstado().name() : null,
                pagoDTO
        );
    }
}

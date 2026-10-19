package com.example.citas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.citas.dto.PagoRequestDTO;
import com.example.citas.dto.PagoResponseDTO;
import com.example.citas.exception.RecursoNoEncontradoException;
import com.example.citas.exception.ReglaDeNegocioException;
import com.example.citas.model.entity.Cita;
import com.example.citas.model.entity.Pago;
import com.example.citas.model.enums.EstadoCita;
import com.example.citas.model.enums.MetodoPago;
import com.example.citas.repository.CitaRepository;
import com.example.citas.repository.PagoRepository;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final CitaRepository citaRepository;

    public PagoService(PagoRepository pagoRepository, CitaRepository citaRepository) {
        this.pagoRepository = pagoRepository;
        this.citaRepository = citaRepository;
    }

    public List<PagoResponseDTO> obtenerTodos() {
        return pagoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public PagoResponseDTO obtenerPorId(Long id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pago no encontrado con id: " + id));
        return convertirADTO(pago);
    }

    public PagoResponseDTO obtenerPorCitaId(Long citaId) {
        Pago pago = pagoRepository.findByCitaId(citaId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe pago para la cita con id: " + citaId));
        return convertirADTO(pago);
    }

    public PagoResponseDTO registrarPago(PagoRequestDTO dto) {
        validarCamposObligatorios(dto);

        Cita cita = citaRepository.findById(dto.citaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada con id: " + dto.citaId()));

        // REGLA DE NEGOCIO: No se puede pagar una cita en estado CANCELADA (Uso del Enum EstadoCita)
        if (cita.getEstado() == EstadoCita.CANCELADA) {
            throw new ReglaDeNegocioException("No se puede registrar un pago para una cita que ha sido cancelada");
        }

        // REGLA DE NEGOCIO: Unicidad 1 a 1 (una cita no puede tener más de un pago)
        if (pagoRepository.existsByCitaId(dto.citaId())) {
            throw new ReglaDeNegocioException("La cita con id " + dto.citaId() + " ya cuenta con un pago registrado (relación 1 a 1)");
        }

        // REGLA DE NEGOCIO: El monto a pagar debe cubrir el costo del servicio
        Double precioServicio = cita.getServicio().getPrecio();
        if (dto.monto() < precioServicio) {
            throw new ReglaDeNegocioException("El monto a pagar ($" + dto.monto() + ") no puede ser menor al precio del servicio ($" + precioServicio + ")");
        }

        LocalDateTime fecha = (dto.fechaPago() != null) ? dto.fechaPago() : LocalDateTime.now();

        MetodoPago metodo;
        try {
            metodo = MetodoPago.valueOf(dto.metodoPago().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ReglaDeNegocioException("Método de pago inválido. Valores permitidos: EFECTIVO, TARJETA, TRANSFERENCIA");
        }

        Pago pago = new Pago(null, dto.monto(), metodo, fecha, cita);
        Pago guardado = pagoRepository.save(pago);

        // Si la cita estaba en PENDIENTE, al recibir el pago se actualiza a CONFIRMADA
        if (cita.getEstado() == EstadoCita.PENDIENTE) {
            cita.setEstado(EstadoCita.CONFIRMADA);
            citaRepository.save(cita);
        }

        return convertirADTO(guardado);
    }

    public void eliminar(Long id) {
        if (!pagoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Pago no encontrado con id: " + id);
        }
        pagoRepository.deleteById(id);
    }

    private void validarCamposObligatorios(PagoRequestDTO dto) {
        if (dto.citaId() == null) {
            throw new ReglaDeNegocioException("El ID de la cita es obligatorio");
        }
        if (dto.monto() == null || dto.monto() <= 0) {
            throw new ReglaDeNegocioException("El monto del pago debe ser mayor a cero");
        }
        if (dto.metodoPago() == null || dto.metodoPago().trim().isEmpty()) {
            throw new ReglaDeNegocioException("El método de pago es obligatorio");
        }
    }

    public PagoResponseDTO convertirADTO(Pago pago) {
        return new PagoResponseDTO(
                pago.getId(),
                pago.getCita().getId(),
                pago.getMonto(),
                pago.getMetodoPago() != null ? pago.getMetodoPago().name() : null,
                pago.getFechaPago()
        );
    }
}

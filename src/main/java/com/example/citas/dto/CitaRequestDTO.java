package com.example.citas.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos para agendar o reprogramar una cita")
public record CitaRequestDTO(
        @Schema(description = "ID del cliente que solicita la cita", example = "1")
        Long clienteId,

        @Schema(description = "ID del profesional que atenderá la cita", example = "1")
        Long profesionalId,

        @Schema(description = "ID del servicio a prestar", example = "1")
        Long servicioId,

        @Schema(description = "Fecha y hora de la cita (ISO-8601)", example = "2026-11-01T10:30:00")
        LocalDateTime fechaHora,

        @Schema(description = "Motivo u observaciones de la cita", example = "Dolor recurrente en molar superior")
        String motivo,

        @Schema(description = "Estado de la cita (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA)", example = "PENDIENTE")
        String estado
) {
}

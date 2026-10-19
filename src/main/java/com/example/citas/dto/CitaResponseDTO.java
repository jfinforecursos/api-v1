package com.example.citas.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos completos de la cita agendada")
public record CitaResponseDTO(
        @Schema(description = "Identificador único de la cita", example = "1")
        Long id,

        @Schema(description = "Cliente asociado a la cita")
        ClienteResponseDTO cliente,

        @Schema(description = "Profesional asignado a la cita")
        ProfesionalResponseDTO profesional,

        @Schema(description = "Servicio agendado")
        ServicioResponseDTO servicio,

        @Schema(description = "Fecha y hora de la cita", example = "2026-11-01T10:30:00")
        LocalDateTime fechaHora,

        @Schema(description = "Motivo de la cita", example = "Dolor recurrente en molar superior")
        String motivo,

        @Schema(description = "Estado actual de la cita", example = "PENDIENTE")
        String estado,

        @Schema(description = "Información del pago asociado (Relación 1 a 1)")
        PagoResponseDTO pago
) {
}

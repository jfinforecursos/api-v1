package com.example.citas.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos para registrar el pago de una cita (Relación 1 a 1)")
public record PagoRequestDTO(
        @Schema(description = "ID de la cita a pagar", example = "1")
        Long citaId,

        @Schema(description = "Monto total pagado", example = "45.00")
        Double monto,

        @Schema(description = "Método de pago (EFECTIVO, TARJETA, TRANSFERENCIA)", example = "TARJETA")
        String metodoPago,

        @Schema(description = "Fecha y hora del pago (si es null se asigna la actual)", example = "2026-11-05T09:45:00")
        LocalDateTime fechaPago
) {
}

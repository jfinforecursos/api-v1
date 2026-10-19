package com.example.citas.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos retornados de un pago registrado")
public record PagoResponseDTO(
        @Schema(description = "Identificador único del comprobante de pago", example = "1")
        Long id,

        @Schema(description = "Identificador de la cita asociada", example = "1")
        Long citaId,

        @Schema(description = "Monto pagado", example = "45.00")
        Double monto,

        @Schema(description = "Método de pago utilizado", example = "TARJETA")
        String metodoPago,

        @Schema(description = "Fecha y hora del pago", example = "2026-11-05T09:45:00")
        LocalDateTime fechaPago
) {
}

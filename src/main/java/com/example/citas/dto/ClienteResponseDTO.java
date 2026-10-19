package com.example.citas.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos retornados de un cliente")
public record ClienteResponseDTO(
        @Schema(description = "Identificador único del cliente", example = "1")
        Long id,

        @Schema(description = "Nombre completo del cliente", example = "Juan Pérez")
        String nombre,

        @Schema(description = "Correo electrónico del cliente", example = "juan.perez@example.com")
        String email,

        @Schema(description = "Número telefónico del cliente", example = "555-1234")
        String telefono
) {
}

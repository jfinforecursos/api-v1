package com.example.citas.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos para registrar o actualizar un cliente")
public record ClienteRequestDTO(
        @Schema(description = "Nombre completo del cliente", example = "Juan Pérez")
        String nombre,

        @Schema(description = "Correo electrónico del cliente", example = "juan.perez@example.com")
        String email,

        @Schema(description = "Número telefónico de contacto", example = "555-1234")
        String telefono
) {
}

package com.example.citas.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos para registrar o actualizar un profesional")
public record ProfesionalRequestDTO(
        @Schema(description = "Nombre completo del profesional", example = "Dra. Carolina Ríos")
        String nombre,

        @Schema(description = "Especialidad o área", example = "Odontología General")
        String especialidad,

        @Schema(description = "Correo electrónico profesional", example = "carolina.rios@clinica.com")
        String email,

        @Schema(description = "Teléfono de contacto", example = "555-4321")
        String telefono
) {
}

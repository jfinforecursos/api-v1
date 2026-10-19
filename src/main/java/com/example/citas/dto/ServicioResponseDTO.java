package com.example.citas.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos retornados de un servicio")
public record ServicioResponseDTO(
        @Schema(description = "Identificador único del servicio", example = "1")
        Long id,

        @Schema(description = "Nombre del servicio", example = "Limpieza Dental y Profilaxis")
        String nombre,

        @Schema(description = "Descripción del servicio", example = "Eliminación de sarro y pulido dental")
        String descripcion,

        @Schema(description = "Precio del servicio", example = "45.00")
        Double precio,

        @Schema(description = "Duración estimada en minutos", example = "45")
        Integer duracionMinutos
) {
}

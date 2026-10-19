package com.example.citas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.citas.dto.ServicioRequestDTO;
import com.example.citas.dto.ServicioResponseDTO;
import com.example.citas.service.ServicioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Servicios", description = "Gestión del catálogo de servicios")
@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @Operation(summary = "Obtener todos los servicios", description = "Lista completa de servicios disponibles")
    @GetMapping
    public List<ServicioResponseDTO> obtenerTodos() {
        return servicioService.obtenerTodos();
    }

    @Operation(summary = "Obtener un servicio por ID", description = "Detalles de un servicio específico")
    @GetMapping("/{id}")
    public ResponseEntity<ServicioResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicioService.obtenerPorId(id));
    }

    @Operation(summary = "Crear un nuevo servicio", description = "Registra un nuevo servicio en el catálogo")
    @PostMapping
    public ResponseEntity<ServicioResponseDTO> crear(@RequestBody ServicioRequestDTO dto) {
        ServicioResponseDTO nuevo = servicioService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @Operation(summary = "Actualizar un servicio", description = "Modifica los datos de un servicio existente")
    @PutMapping("/{id}")
    public ResponseEntity<ServicioResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.ok(servicioService.actualizar(id, dto));
    }

    @Operation(summary = "Eliminar un servicio", description = "Elimina un servicio por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

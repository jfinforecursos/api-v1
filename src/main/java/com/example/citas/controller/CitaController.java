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

import com.example.citas.dto.CitaRequestDTO;
import com.example.citas.dto.CitaResponseDTO;
import com.example.citas.service.CitaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Citas", description = "Endpoints para la gestión y agendamiento de citas")
@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @Operation(summary = "Obtener todas las citas", description = "Retorna el listado completo de citas agendadas")
    @GetMapping
    public List<CitaResponseDTO> obtenerTodas() {
        return citaService.obtenerTodas();
    }

    @Operation(summary = "Obtener una cita por ID", description = "Busca los detalles de una cita específica")
    @GetMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> obtenerPorId(@PathVariable Long id) {
        CitaResponseDTO cita = citaService.obtenerPorId(id);
        return ResponseEntity.ok(cita);
    }

    @Operation(summary = "Obtener citas de un cliente (Relación 1 a Muchos)", description = "Retorna todas las citas asociadas al cliente")
    @GetMapping("/cliente/{clienteId}")
    public List<CitaResponseDTO> obtenerPorCliente(@PathVariable Long clienteId) {
        return citaService.obtenerPorCliente(clienteId);
    }

    @Operation(summary = "Agendar una nueva cita", description = "Crea y registra una cita con estado PENDIENTE por defecto")
    @PostMapping
    public ResponseEntity<CitaResponseDTO> agendar(@RequestBody CitaRequestDTO dto) {
        CitaResponseDTO nuevaCita = citaService.agendar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCita);
    }

    @Operation(summary = "Actualizar o reprogramar una cita", description = "Modifica los datos o el estado de una cita existente")
    @PutMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody CitaRequestDTO dto) {
        CitaResponseDTO citaActualizada = citaService.actualizar(id, dto);
        return ResponseEntity.ok(citaActualizada);
    }

    @Operation(summary = "Eliminar o cancelar una cita", description = "Elimina permanentemente el registro de una cita")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        citaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

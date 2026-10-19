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

import com.example.citas.dto.ProfesionalRequestDTO;
import com.example.citas.dto.ProfesionalResponseDTO;
import com.example.citas.service.ProfesionalService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Profesionales", description = "Gestión de especialistas y profesionales")
@RestController
@RequestMapping("/api/profesionales")
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    public ProfesionalController(ProfesionalService profesionalService) {
        this.profesionalService = profesionalService;
    }

    @Operation(summary = "Obtener todos los profesionales", description = "Lista completa de profesionales registrados")
    @GetMapping
    public List<ProfesionalResponseDTO> obtenerTodos() {
        return profesionalService.obtenerTodos();
    }

    @Operation(summary = "Obtener un profesional por ID", description = "Detalles de un profesional específico")
    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(profesionalService.obtenerPorId(id));
    }

    @Operation(summary = "Crear un nuevo profesional", description = "Registra un nuevo especialista o profesional")
    @PostMapping
    public ResponseEntity<ProfesionalResponseDTO> crear(@RequestBody ProfesionalRequestDTO dto) {
        ProfesionalResponseDTO nuevo = profesionalService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @Operation(summary = "Actualizar un profesional", description = "Modifica los datos de un profesional existente")
    @PutMapping("/{id}")
    public ResponseEntity<ProfesionalResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody ProfesionalRequestDTO dto) {
        return ResponseEntity.ok(profesionalService.actualizar(id, dto));
    }

    @Operation(summary = "Eliminar un profesional", description = "Elimina un profesional por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        profesionalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

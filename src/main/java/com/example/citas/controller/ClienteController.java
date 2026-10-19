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

import com.example.citas.dto.ClienteRequestDTO;
import com.example.citas.dto.ClienteResponseDTO;
import com.example.citas.service.ClienteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Clientes", description = "Gestión de clientes de la plataforma de citas")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Operation(summary = "Obtener todos los clientes", description = "Lista completa de clientes registrados")
    @GetMapping
    public List<ClienteResponseDTO> obtenerTodos() {
        return clienteService.obtenerTodos();
    }

    @Operation(summary = "Obtener un cliente por ID", description = "Detalles de un cliente específico")
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obtenerPorId(id));
    }

    @Operation(summary = "Crear un nuevo cliente", description = "Registra un nuevo cliente con sus datos de contacto")
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> crear(@RequestBody ClienteRequestDTO dto) {
        ClienteResponseDTO nuevo = clienteService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @Operation(summary = "Actualizar un cliente", description = "Modifica los datos de un cliente existente")
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.ok(clienteService.actualizar(id, dto));
    }

    @Operation(summary = "Eliminar un cliente", description = "Elimina un cliente por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

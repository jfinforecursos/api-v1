package com.example.citas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.citas.dto.PagoRequestDTO;
import com.example.citas.dto.PagoResponseDTO;
import com.example.citas.service.PagoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Pagos", description = "Gestión de pagos de citas (Relación 1 a 1)")
@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @Operation(summary = "Obtener todos los pagos", description = "Lista completa de pagos registrados")
    @GetMapping
    public List<PagoResponseDTO> obtenerTodos() {
        return pagoService.obtenerTodos();
    }

    @Operation(summary = "Obtener un pago por ID", description = "Busca los detalles de un pago específico")
    @GetMapping("/{id}")
    public ResponseEntity<PagoResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pagoService.obtenerPorId(id));
    }

    @Operation(summary = "Obtener el pago de una cita (Relación 1 a 1)", description = "Busca el pago correspondiente a una cita")
    @GetMapping("/cita/{citaId}")
    public ResponseEntity<PagoResponseDTO> obtenerPorCitaId(@PathVariable Long citaId) {
        return ResponseEntity.ok(pagoService.obtenerPorCitaId(citaId));
    }

    @Operation(summary = "Registrar un pago para una cita", description = "Registra el pago asegurando la regla 1 a 1 (una cita no puede tener más de un pago)")
    @PostMapping
    public ResponseEntity<PagoResponseDTO> registrarPago(@RequestBody PagoRequestDTO dto) {
        PagoResponseDTO nuevoPago = pagoService.registrarPago(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPago);
    }

    @Operation(summary = "Eliminar un pago", description = "Elimina un pago por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

package com.example.citas.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.citas.model.entity.Cita;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    // Consulta para explotar la relación Uno a Muchos (un cliente -> muchas citas)
    List<Cita> findByClienteId(Long clienteId);

    // Consulta para validar regla de negocio: no solapamiento de horario para el mismo profesional
    boolean existsByProfesionalIdAndFechaHora(Long profesionalId, LocalDateTime fechaHora);
}

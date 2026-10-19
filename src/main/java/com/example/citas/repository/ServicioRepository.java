package com.example.citas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.citas.model.entity.Servicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
}

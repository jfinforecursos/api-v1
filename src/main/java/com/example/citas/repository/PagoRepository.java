package com.example.citas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.citas.model.entity.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    Optional<Pago> findByCitaId(Long citaId);
    boolean existsByCitaId(Long citaId);
}

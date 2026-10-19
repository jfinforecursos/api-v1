package com.example.citas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.citas.model.entity.Profesional;

@Repository
public interface ProfesionalRepository extends JpaRepository<Profesional, Long> {
    boolean existsByContactoEmail(String email);
}

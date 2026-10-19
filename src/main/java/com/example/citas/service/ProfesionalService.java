package com.example.citas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.citas.dto.ProfesionalRequestDTO;
import com.example.citas.dto.ProfesionalResponseDTO;
import com.example.citas.exception.RecursoNoEncontradoException;
import com.example.citas.exception.ReglaDeNegocioException;
import com.example.citas.model.entity.Profesional;
import com.example.citas.repository.ProfesionalRepository;

@Service
public class ProfesionalService {

    private final ProfesionalRepository profesionalRepository;

    public ProfesionalService(ProfesionalRepository profesionalRepository) {
        this.profesionalRepository = profesionalRepository;
    }

    public List<ProfesionalResponseDTO> obtenerTodos() {
        return profesionalRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public ProfesionalResponseDTO obtenerPorId(Long id) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Profesional no encontrado con id: " + id));
        return convertirADTO(profesional);
    }

    public ProfesionalResponseDTO crear(ProfesionalRequestDTO dto) {
        validarDTO(dto);

        if (dto.email() != null && !dto.email().isBlank() && profesionalRepository.existsByContactoEmail(dto.email().trim())) {
            throw new ReglaDeNegocioException("Ya existe un profesional registrado con el email: " + dto.email());
        }

        Profesional profesional = new Profesional(null, dto.nombre(), dto.especialidad(), dto.email(), dto.telefono());
        Profesional guardado = profesionalRepository.save(profesional);
        return convertirADTO(guardado);
    }

    public ProfesionalResponseDTO actualizar(Long id, ProfesionalRequestDTO dto) {
        validarDTO(dto);
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Profesional no encontrado con id: " + id));

        if (dto.email() != null && !dto.email().isBlank() &&
                !dto.email().trim().equalsIgnoreCase(profesional.getEmail()) &&
                profesionalRepository.existsByContactoEmail(dto.email().trim())) {
            throw new ReglaDeNegocioException("El email " + dto.email() + " ya está en uso por otro profesional");
        }

        profesional.setNombre(dto.nombre());
        profesional.setEspecialidad(dto.especialidad());
        profesional.setEmail(dto.email());
        profesional.setTelefono(dto.telefono());

        Profesional actualizado = profesionalRepository.save(profesional);
        return convertirADTO(actualizado);
    }

    public void eliminar(Long id) {
        if (!profesionalRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Profesional no encontrado con id: " + id);
        }
        profesionalRepository.deleteById(id);
    }

    private void validarDTO(ProfesionalRequestDTO dto) {
        if (dto.nombre() == null || dto.nombre().trim().isEmpty()) {
            throw new ReglaDeNegocioException("El nombre del profesional no puede estar vacío");
        }
        if (dto.especialidad() == null || dto.especialidad().trim().isEmpty()) {
            throw new ReglaDeNegocioException("La especialidad del profesional es requerida");
        }
    }

    public ProfesionalResponseDTO convertirADTO(Profesional profesional) {
        return new ProfesionalResponseDTO(
                profesional.getId(),
                profesional.getNombre(),
                profesional.getEspecialidad(),
                profesional.getEmail(),
                profesional.getTelefono()
        );
    }
}

package com.example.citas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.citas.dto.ServicioRequestDTO;
import com.example.citas.dto.ServicioResponseDTO;
import com.example.citas.exception.RecursoNoEncontradoException;
import com.example.citas.exception.ReglaDeNegocioException;
import com.example.citas.model.entity.Servicio;
import com.example.citas.repository.ServicioRepository;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;

    public ServicioService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    public List<ServicioResponseDTO> obtenerTodos() {
        return servicioRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public ServicioResponseDTO obtenerPorId(Long id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Servicio no encontrado con id: " + id));
        return convertirADTO(servicio);
    }

    public ServicioResponseDTO crear(ServicioRequestDTO dto) {
        validarDTO(dto);
        Servicio servicio = new Servicio(null, dto.nombre(), dto.descripcion(), dto.precio(), dto.duracionMinutos());
        Servicio guardado = servicioRepository.save(servicio);
        return convertirADTO(guardado);
    }

    public ServicioResponseDTO actualizar(Long id, ServicioRequestDTO dto) {
        validarDTO(dto);
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Servicio no encontrado con id: " + id));

        servicio.setNombre(dto.nombre());
        servicio.setDescripcion(dto.descripcion());
        servicio.setPrecio(dto.precio());
        servicio.setDuracionMinutos(dto.duracionMinutos());

        Servicio actualizado = servicioRepository.save(servicio);
        return convertirADTO(actualizado);
    }

    public void eliminar(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Servicio no encontrado con id: " + id);
        }
        servicioRepository.deleteById(id);
    }

    private void validarDTO(ServicioRequestDTO dto) {
        if (dto.nombre() == null || dto.nombre().trim().isEmpty()) {
            throw new ReglaDeNegocioException("El nombre del servicio no puede estar vacío");
        }
        if (dto.precio() == null || dto.precio() <= 0) {
            throw new ReglaDeNegocioException("El precio del servicio debe ser mayor a cero");
        }
        if (dto.duracionMinutos() == null || dto.duracionMinutos() <= 0) {
            throw new ReglaDeNegocioException("La duración del servicio debe ser mayor a cero minutos");
        }
    }

    public ServicioResponseDTO convertirADTO(Servicio servicio) {
        return new ServicioResponseDTO(
                servicio.getId(),
                servicio.getNombre(),
                servicio.getDescripcion(),
                servicio.getPrecio(),
                servicio.getDuracionMinutos()
        );
    }
}

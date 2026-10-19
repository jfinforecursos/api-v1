package com.example.citas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.citas.dto.ClienteRequestDTO;
import com.example.citas.dto.ClienteResponseDTO;
import com.example.citas.exception.RecursoNoEncontradoException;
import com.example.citas.exception.ReglaDeNegocioException;
import com.example.citas.model.entity.Cliente;
import com.example.citas.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ClienteResponseDTO> obtenerTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public ClienteResponseDTO obtenerPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con id: " + id));
        return convertirADTO(cliente);
    }

    public ClienteResponseDTO crear(ClienteRequestDTO dto) {
        validarDTO(dto);

        if (clienteRepository.existsByContactoEmail(dto.email().trim())) {
            throw new ReglaDeNegocioException("Ya existe un cliente registrado con el email: " + dto.email());
        }

        Cliente cliente = new Cliente(null, dto.nombre(), dto.email(), dto.telefono());
        Cliente guardado = clienteRepository.save(cliente);
        return convertirADTO(guardado);
    }

    public ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto) {
        validarDTO(dto);
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con id: " + id));

        if (!dto.email().trim().equalsIgnoreCase(cliente.getEmail()) &&
                clienteRepository.existsByContactoEmail(dto.email().trim())) {
            throw new ReglaDeNegocioException("El email " + dto.email() + " ya está registrado para otro cliente");
        }

        cliente.setNombre(dto.nombre());
        cliente.setEmail(dto.email());
        cliente.setTelefono(dto.telefono());

        Cliente actualizado = clienteRepository.save(cliente);
        return convertirADTO(actualizado);
    }

    public void eliminar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Cliente no encontrado con id: " + id);
        }
        clienteRepository.deleteById(id);
    }

    private void validarDTO(ClienteRequestDTO dto) {
        if (dto.nombre() == null || dto.nombre().trim().isEmpty()) {
            throw new ReglaDeNegocioException("El nombre del cliente no puede estar vacío");
        }
        if (dto.email() == null || dto.email().trim().isEmpty()) {
            throw new ReglaDeNegocioException("El email del cliente no puede estar vacío");
        }
    }

    public ClienteResponseDTO convertirADTO(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getEmail(),
                cliente.getTelefono()
        );
    }
}

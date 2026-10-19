package com.example.citas.config;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.citas.model.embeddable.Contacto;
import com.example.citas.model.entity.Cita;
import com.example.citas.model.entity.Cliente;
import com.example.citas.model.entity.Pago;
import com.example.citas.model.entity.Profesional;
import com.example.citas.model.entity.Servicio;
import com.example.citas.model.enums.EstadoCita;
import com.example.citas.model.enums.MetodoPago;
import com.example.citas.repository.CitaRepository;
import com.example.citas.repository.ClienteRepository;
import com.example.citas.repository.PagoRepository;
import com.example.citas.repository.ProfesionalRepository;
import com.example.citas.repository.ServicioRepository;

@Configuration
public class DataSeederConfig {

    @Bean
    public CommandLineRunner sembrarDatos(
            ClienteRepository clienteRepository,
            ProfesionalRepository profesionalRepository,
            ServicioRepository servicioRepository,
            CitaRepository citaRepository,
            PagoRepository pagoRepository) {
        return args -> {
            if (clienteRepository.count() == 0) {
                // 1. Clientes con objeto embebido @Embeddable (Contacto) y herencia @MappedSuperclass (AuditoriaBase)
                Cliente c1 = new Cliente(null, "Juan Pérez", new Contacto("juan.perez@example.com", "555-1234"));
                Cliente c2 = new Cliente(null, "María Gómez", new Contacto("maria.gomez@example.com", "555-5678"));
                clienteRepository.saveAll(List.of(c1, c2));

                // 2. Profesionales con objeto embebido @Embeddable (Contacto)
                Profesional p1 = new Profesional(null, "Dra. Carolina Ríos", "Odontología", new Contacto("carolina.rios@clinica.com", "555-4321"));
                Profesional p2 = new Profesional(null, "Dr. Roberto Silva", "Medicina General", new Contacto("roberto.silva@clinica.com", "555-8765"));
                profesionalRepository.saveAll(List.of(p1, p2));

                // 3. Servicios
                Servicio s1 = new Servicio(null, "Limpieza Dental", "Profilaxis y remoción de sarro", 45.0, 40);
                Servicio s2 = new Servicio(null, "Consulta Médica General", "Evaluación clínica integral y diagnóstico", 35.0, 30);
                Servicio s3 = new Servicio(null, "Extracción Simple", "Extracción dental con anestesia local", 70.0, 45);
                servicioRepository.saveAll(List.of(s1, s2, s3));

                // 4. Citas con Enum @Enumerated (EstadoCita)
                Cita cita1 = new Cita(
                        null,
                        c1,
                        p1,
                        s1,
                        LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0).withNano(0),
                        "Limpieza semestral de rutina",
                        EstadoCita.CONFIRMADA
                );

                Cita cita2 = new Cita(
                        null,
                        c1,
                        p1,
                        s3,
                        LocalDateTime.now().plusDays(15).withHour(11).withMinute(0).withSecond(0).withNano(0),
                        "Extracción molar de seguimiento",
                        EstadoCita.PENDIENTE
                );

                Cita cita3 = new Cita(
                        null,
                        c2,
                        p2,
                        s2,
                        LocalDateTime.now().plusDays(2).withHour(15).withMinute(30).withSecond(0).withNano(0),
                        "Control de presión arterial y chequeo",
                        EstadoCita.PENDIENTE
                );

                citaRepository.saveAll(List.of(cita1, cita2, cita3));

                // 5. Pagos con Enum @Enumerated (MetodoPago)
                Pago pago1 = new Pago(
                        null,
                        s1.getPrecio(),
                        MetodoPago.TARJETA,
                        LocalDateTime.now().minusHours(1),
                        cita1
                );
                pagoRepository.save(pago1);

                System.out.println(">>> SEED EXITOSA: 5 entidades sembradas usando @MappedSuperclass, @Embeddable y @Enumerated.");
            }
        };
    }
}

# Capítulo 8: Datos Iniciales (Seeders) y Documentación con Swagger y Scalar

En este capítulo aprenderás cómo hacer que tu aplicación arranque siempre con **datos de prueba listos para usar** (sin tener que insertarlos a mano cada vez que inicias el servidor) y cómo generar una **documentación interactiva y hermosa** para que cualquier programador pueda probar los endpoints desde su navegador.

---

## 1. ¿Qué es un *Data Seeder* y por qué lo usamos?

Cuando estás desarrollando o mostrando tu proyecto a un profesor o colega, es muy frustrante iniciar la aplicación con la base de datos completamente vacía.
Un **Seeder** (*sembrador de datos*) es un componente que se ejecuta automáticamente cuando Spring Boot termina de arrancar, e inserta registros de ejemplo en las tablas.

En nuestro proyecto lo implementamos con **`CommandLineRunner`** en [DataSeederConfig.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/config/DataSeederConfig.java):

```java
package com.example.citas.config;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.citas.model.embeddable.Contacto;
import com.example.citas.model.entity.*;
import com.example.citas.model.enums.*;
import com.example.citas.repository.*;

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
            // REGLA CLAVE: Solo sembramos si la base de datos está vacía
            if (clienteRepository.count() == 0) {

                // 1. Crear 2 clientes con objeto embebido Contacto
                Cliente c1 = new Cliente(null, "Juan Pérez", new Contacto("juan.perez@example.com", "555-1234"));
                Cliente c2 = new Cliente(null, "María Gómez", new Contacto("maria.gomez@example.com", "555-5678"));
                clienteRepository.saveAll(List.of(c1, c2));

                // 2. Crear 2 profesionales
                Profesional p1 = new Profesional(null, "Dra. Carolina Ríos", "Odontología", new Contacto("carolina.rios@clinica.com", "555-4321"));
                Profesional p2 = new Profesional(null, "Dr. Roberto Silva", "Medicina General", new Contacto("roberto.silva@clinica.com", "555-8765"));
                profesionalRepository.saveAll(List.of(p1, p2));

                // 3. Crear 3 servicios en el catálogo
                Servicio s1 = new Servicio(null, "Limpieza Dental", "Profilaxis y remoción de sarro", 45.0, 40);
                Servicio s2 = new Servicio(null, "Consulta Médica General", "Evaluación clínica integral", 35.0, 30);
                Servicio s3 = new Servicio(null, "Extracción Simple", "Extracción dental con anestesia local", 70.0, 45);
                servicioRepository.saveAll(List.of(s1, s2, s3));

                // 4. Crear citas conectando las entidades (demostrando relación 1 a Muchos)
                Cita cita1 = new Cita(null, c1, p1, s1, LocalDateTime.now().plusDays(1).withHour(10).withMinute(0), "Limpieza semestral", EstadoCita.CONFIRMADA);
                Cita cita2 = new Cita(null, c1, p1, s3, LocalDateTime.now().plusDays(15).withHour(11).withMinute(0), "Extracción molar", EstadoCita.PENDIENTE);
                Cita cita3 = new Cita(null, c2, p2, s2, LocalDateTime.now().plusDays(2).withHour(15).withMinute(30), "Chequeo médico", EstadoCita.PENDIENTE);
                citaRepository.saveAll(List.of(cita1, cita2, cita3));

                // 5. Crear el pago para la cita1 (demostrando relación 1 a 1)
                Pago pago1 = new Pago(null, s1.getPrecio(), MetodoPago.TARJETA, LocalDateTime.now().minusHours(1), cita1);
                pagoRepository.save(pago1);

                System.out.println(">>> SEED EXITOSA: 5 entidades sembradas con relaciones 1:1 y 1:N.");
            }
        };
    }
}
```

### ¿Por qué es fundamental la línea `if (clienteRepository.count() == 0)`?
Porque si reinicias tu servidor 10 veces al día, no querrás tener 20 o 30 clientes duplicados en la base de datos. La condición garantiza que la siembra se ejecute **una única vez** al crear la base de datos limpia.

---

## 2. Documentación con Swagger UI y OpenAPI

En lugar de tener que redactar documentos PDF desactualizados sobre cómo usar tu API, SpringDoc genera la especificación **OpenAPI 3** y una interfaz interactiva de forma automática.

### A. Configuración Global ([OpenApiConfig.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/config/OpenApiConfig.java)):
```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Agendamiento de Citas y Pagos")
                        .version("1.0.0")
                        .description("API REST para la administración de Citas, Clientes, Profesionales, Servicios y Pagos..."));
    }
}
```

### B. Anotaciones de Documentación en los Controladores:
- **`@Tag(name = "Citas", description = "...")`:** Agrupa todos los endpoints bajo una pestaña temática.
- **`@Operation(summary = "...", description = "...")`:** Explica en una frase qué hace el endpoint y qué condiciones requiere.

### C. Anotación `@Schema` en los DTOs:
En nuestros DTOs (como [CitaRequestDTO.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/dto/CitaRequestDTO.java)):
```java
public record CitaRequestDTO(
    @Schema(description = "ID del cliente que solicita la cita", example = "1")
    Long clienteId,

    @Schema(description = "Fecha y hora de la cita (ISO-8601)", example = "2026-11-01T10:30:00")
    LocalDateTime fechaHora
    // ...
) {}
```
Esto permite que Swagger pre-rellene la interfaz con datos de ejemplo realistas.

---

## 3. ¿Cómo probar la API en el Navegador?

Una vez encendida la aplicación (`./mvnw spring-boot:run`):

1. **Swagger UI Clásico:**
   Abre en tu navegador:
   `http://localhost:8080/swagger-ui/index.html`
   - Haz clic en cualquier endpoint (ej: `POST /api/citas`).
   - Haz clic en el botón **"Try it out"**.
   - Verás el JSON de ejemplo ya preparado.
   - Presiona **"Execute"** y verás la respuesta real de la base de datos con su código HTTP (201 CREATED).

2. **Scalar (Interfaz Moderna de Última Generación):**
   Abre en tu navegador:
   `http://localhost:8080/scalar`
   - Disfruta de un diseño oscuro ultra-rápido, con ejemplos de código listos para copiar en JavaScript (`fetch`), cURL, Python y más.

En el último capítulo aprenderás cómo **empaquetar la aplicación con Docker y desplegarla en la nube en Render.com**.

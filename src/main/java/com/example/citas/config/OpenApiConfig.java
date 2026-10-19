package com.example.citas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Agendamiento de Citas y Pagos")
                        .version("1.0.0")
                        .description("API REST para la administración de Citas, Clientes, Profesionales, Servicios y Pagos con relaciones Uno a Uno (Cita-Pago) y Uno a Muchos (Cliente-Citas), utilizando DTOs y arquitectura por capas.")
                        .contact(new Contact()
                                .name("Soporte Técnico")
                                .email("soporte@citasapp.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}

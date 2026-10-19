package com.example.citas.model.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * Objeto de valor embebido (@Embeddable) para encapsular la información
 * de contacto en entidades como Cliente y Profesional.
 */
@Embeddable
public class Contacto {

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    public Contacto() {
    }

    public Contacto(String email, String telefono) {
        this.email = email;
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}

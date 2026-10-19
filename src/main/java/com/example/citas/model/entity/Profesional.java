package com.example.citas.model.entity;

import com.example.citas.model.base.BaseEntity;
import com.example.citas.model.embeddable.Contacto;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "profesionales")
public class Profesional extends BaseEntity {

    private String nombre;
    private String especialidad;

    // Uso de objeto embebido @Embeddable
    @Embedded
    private Contacto contacto;

    public Profesional() {
    }

    public Profesional(Long id, String nombre, String especialidad, Contacto contacto) {
        super(id);
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.contacto = contacto;
    }

    public Profesional(Long id, String nombre, String especialidad, String email, String telefono) {
        super(id);
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.contacto = new Contacto(email, telefono);
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public Contacto getContacto() {
        return contacto;
    }

    public void setContacto(Contacto contacto) {
        this.contacto = contacto;
    }

    public String getEmail() {
        return contacto != null ? contacto.getEmail() : null;
    }

    public void setEmail(String email) {
        if (this.contacto == null) {
            this.contacto = new Contacto();
        }
        this.contacto.setEmail(email);
    }

    public String getTelefono() {
        return contacto != null ? contacto.getTelefono() : null;
    }

    public void setTelefono(String telefono) {
        if (this.contacto == null) {
            this.contacto = new Contacto();
        }
        this.contacto.setTelefono(telefono);
    }
}

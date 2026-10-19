package com.example.citas.model.entity;

import java.util.ArrayList;
import java.util.List;

import com.example.citas.model.base.BaseEntity;
import com.example.citas.model.embeddable.Contacto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "clientes")
public class Cliente extends BaseEntity {

    private String nombre;

    // Uso de objeto embebido @Embeddable
    @Embedded
    private Contacto contacto;

    // Relación Uno a Muchos: Un cliente puede tener múltiples citas registradas
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cita> citas = new ArrayList<>();

    public Cliente() {
    }

    public Cliente(Long id, String nombre, Contacto contacto) {
        super(id);
        this.nombre = nombre;
        this.contacto = contacto;
    }

    public Cliente(Long id, String nombre, String email, String telefono) {
        super(id);
        this.nombre = nombre;
        this.contacto = new Contacto(email, telefono);
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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

    public List<Cita> getCitas() {
        return citas;
    }

    public void setCitas(List<Cita> citas) {
        this.citas = citas;
    }
}

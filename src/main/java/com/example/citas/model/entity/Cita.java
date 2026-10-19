package com.example.citas.model.entity;

import java.time.LocalDateTime;

import com.example.citas.model.base.BaseEntity;
import com.example.citas.model.enums.EstadoCita;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "citas")
public class Cita extends BaseEntity {

    // Relación Muchos a Uno: Muchas citas pertenecen a un Cliente (inversa de 1:N)
    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "profesional_id", nullable = false)
    private Profesional profesional;

    @ManyToOne(optional = false)
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    private LocalDateTime fechaHora;
    private String motivo;

    // Uso de Enum tipado con persistencia de texto (EnumType.STRING)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCita estado = EstadoCita.PENDIENTE;

    // Relación Uno a Uno: Una cita tiene un único pago asociado
    @OneToOne(mappedBy = "cita", cascade = CascadeType.ALL)
    private Pago pago;

    public Cita() {
    }

    public Cita(Long id, Cliente cliente, Profesional profesional, Servicio servicio, LocalDateTime fechaHora, String motivo, EstadoCita estado) {
        super(id);
        this.cliente = cliente;
        this.profesional = profesional;
        this.servicio = servicio;
        this.fechaHora = fechaHora;
        this.motivo = motivo;
        this.estado = (estado != null) ? estado : EstadoCita.PENDIENTE;
    }

    public Cita(Long id, Cliente cliente, Profesional profesional, Servicio servicio, LocalDateTime fechaHora, String motivo, String estado) {
        super(id);
        this.cliente = cliente;
        this.profesional = profesional;
        this.servicio = servicio;
        this.fechaHora = fechaHora;
        this.motivo = motivo;
        setEstado(estado);
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Profesional getProfesional() {
        return profesional;
    }

    public void setProfesional(Profesional profesional) {
        this.profesional = profesional;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = (estado != null) ? estado : EstadoCita.PENDIENTE;
    }

    public void setEstado(String estado) {
        if (estado != null && !estado.isBlank()) {
            try {
                this.estado = EstadoCita.valueOf(estado.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                this.estado = EstadoCita.PENDIENTE;
            }
        } else {
            this.estado = EstadoCita.PENDIENTE;
        }
    }

    public Pago getPago() {
        return pago;
    }

    public void setPago(Pago pago) {
        this.pago = pago;
    }
}

package com.example.citas.model.entity;

import java.time.LocalDateTime;

import com.example.citas.model.base.BaseEntity;
import com.example.citas.model.enums.MetodoPago;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pagos")
public class Pago extends BaseEntity {

    private Double monto;

    // Uso de Enum tipado con persistencia de texto (EnumType.STRING)
    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago;

    private LocalDateTime fechaPago;

    // Relación Uno a Uno: Cada pago corresponde exclusivamente a una única cita
    @OneToOne(optional = false)
    @JoinColumn(name = "cita_id", referencedColumnName = "id", unique = true, nullable = false)
    private Cita cita;

    public Pago() {
    }

    public Pago(Long id, Double monto, MetodoPago metodoPago, LocalDateTime fechaPago, Cita cita) {
        super(id);
        this.monto = monto;
        this.metodoPago = metodoPago;
        this.fechaPago = fechaPago;
        this.cita = cita;
    }

    public Pago(Long id, Double monto, String metodoPago, LocalDateTime fechaPago, Cita cita) {
        super(id);
        this.monto = monto;
        setMetodoPago(metodoPago);
        this.fechaPago = fechaPago;
        this.cita = cita;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        if (metodoPago != null && !metodoPago.isBlank()) {
            try {
                this.metodoPago = MetodoPago.valueOf(metodoPago.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                this.metodoPago = MetodoPago.EFECTIVO;
            }
        } else {
            this.metodoPago = MetodoPago.EFECTIVO;
        }
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }
}

package eh.projects.energy.Objects;

import eh.projects.energy.Entitys.Usuario;

import java.time.LocalDate;

public class ProyectoDTO {
    private  Long id;
    private String nombre;
    private String descripcion;
    private LocalDate fecha_inicio;
    private String estado;
    private Usuario responsable;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(LocalDate fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Usuario getResponsable() {
        return responsable;
    }

    public void setResponsable(Usuario responsable) {
        this.responsable = responsable;
    }

    public ProyectoDTO(Long id, String nombre, String descripcion, LocalDate fecha_inicio, String estado, Usuario responsable) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fecha_inicio = fecha_inicio;
        this.estado = estado;
        this.responsable = responsable;
    }

    public ProyectoDTO() {
    }
}

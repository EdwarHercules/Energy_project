package eh.projects.energy.Objects;

import eh.projects.energy.Entitys.GeopuntoEstructura;
import eh.projects.energy.Entitys.Proyecto;

import java.math.BigDecimal;
import java.util.List;

public class GeoPuntoDTO {
    private Long id;
    private Proyecto proyecto;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private BigDecimal utm_x;
    private BigDecimal utm_y;
    private String descripcion;

    private String nombre;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

    public BigDecimal getLatitud() {
        return latitud;
    }

    public void setLatitud(BigDecimal latitud) {
        this.latitud = latitud;
    }

    public BigDecimal getLongitud() {
        return longitud;
    }

    public void setLongitud(BigDecimal longitud) {
        this.longitud = longitud;
    }

    public BigDecimal getUtm_x() {
        return utm_x;
    }

    public void setUtm_x(BigDecimal utm_x) {
        this.utm_x = utm_x;
    }

    public BigDecimal getUtm_y() {
        return utm_y;
    }

    public void setUtm_y(BigDecimal utm_y) {
        this.utm_y = utm_y;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public GeoPuntoDTO(Long id, Proyecto proyecto, BigDecimal latitud, BigDecimal longitud, BigDecimal utm_x, BigDecimal utm_y, String descripcion, String nombre) {
        this.id = id;
        this.proyecto = proyecto;
        this.latitud = latitud;
        this.longitud = longitud;
        this.utm_x = utm_x;
        this.utm_y = utm_y;
        this.descripcion = descripcion;
        this.nombre = nombre;
    }

    public GeoPuntoDTO() {
    }
}

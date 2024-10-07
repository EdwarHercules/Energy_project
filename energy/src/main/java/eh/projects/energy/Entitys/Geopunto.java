package eh.projects.energy.Entitys;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "geopuntos")
public class Geopunto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    private BigDecimal latitud;

    private BigDecimal longitud;

    private BigDecimal utm_x;

    private BigDecimal utm_y;

    private String descripcion;

    @OneToMany(mappedBy = "geopunto", cascade = CascadeType.ALL)
    private List<GeopuntoEstructura> estructuras;

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

    public List<GeopuntoEstructura> getEstructuras() {
        return estructuras;
    }

    public void setEstructuras(List<GeopuntoEstructura> estructuras) {
        this.estructuras = estructuras;
    }
}

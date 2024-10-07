package eh.projects.energy.Entitys;

import jakarta.persistence.*;

@Entity
@Table(name = "proyecto_estructuras")
public class ProyectoEstructura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    @ManyToOne
    @JoinColumn(name = "estructura_id",nullable = false)
    private Estructura estructura;

    private Integer cantidad;

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

    public Estructura getEstructura() {
        return estructura;
    }

    public void setEstructura(Estructura estructura) {
        this.estructura = estructura;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}

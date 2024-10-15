package eh.projects.energy.Objects;

import eh.projects.energy.Entitys.Estructura;
import eh.projects.energy.Entitys.Proyecto;

public class ProyectoEstructuraDTO {
    private Long id;
    private Proyecto proyecto;
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

    public ProyectoEstructuraDTO(Long id, Proyecto proyecto, Estructura estructura, Integer cantidad) {
        this.id = id;
        this.proyecto = proyecto;
        this.estructura = estructura;
        this.cantidad = cantidad;
    }

    public ProyectoEstructuraDTO() {
    }
}

package eh.projects.energy.Objects;

import eh.projects.energy.Entitys.Material;
import eh.projects.energy.Entitys.Proyecto;

public class ProyectoMaterialDTO {
    private  Long id;
    private Proyecto proyecto;
    private Material material;
    private Integer cantidad;
    private String unidad;

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

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getUnidad() {
        return unidad;
    }

    public void setUnidad(String unidad) {
        this.unidad = unidad;
    }

    public ProyectoMaterialDTO(Long id, Proyecto proyecto, Material material, Integer cantidad, String unidad) {
        this.id = id;
        this.proyecto = proyecto;
        this.material = material;
        this.cantidad = cantidad;
        this.unidad = unidad;
    }

    public ProyectoMaterialDTO() {
    }
}

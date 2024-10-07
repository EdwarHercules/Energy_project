package eh.projects.energy.Entitys;

import jakarta.persistence.*;

@Entity
@Table(name = "est_mat")
public class EstMat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_estructura", nullable = false)
    private Estructura estructura;

    @ManyToOne
    @JoinColumn(name = "id_material", nullable = false)
    private Material material;

    private String unidad;

    private Integer cantidad_mat_34kva;

    private Integer cantidad_mat_18kva;

    private Integer cantidad_mat;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Estructura getEstructura() {
        return estructura;
    }

    public void setEstructura(Estructura estructura) {
        this.estructura = estructura;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public String getUnidad() {
        return unidad;
    }

    public void setUnidad(String unidad) {
        this.unidad = unidad;
    }

    public Integer getCantidad_mat_34kva() {
        return cantidad_mat_34kva;
    }

    public void setCantidad_mat_34kva(Integer cantidad_mat_34kva) {
        this.cantidad_mat_34kva = cantidad_mat_34kva;
    }

    public Integer getCantidad_mat_18kva() {
        return cantidad_mat_18kva;
    }

    public void setCantidad_mat_18kva(Integer cantidad_mat_18kva) {
        this.cantidad_mat_18kva = cantidad_mat_18kva;
    }

    public Integer getCantidad_mat() {
        return cantidad_mat;
    }

    public void setCantidad_mat(Integer cantidad_mat) {
        this.cantidad_mat = cantidad_mat;
    }
}

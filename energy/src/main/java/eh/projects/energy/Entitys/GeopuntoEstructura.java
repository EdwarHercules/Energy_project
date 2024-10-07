package eh.projects.energy.Entitys;

import jakarta.persistence.*;

@Entity
@Table(name = "geopunto_estructuras")
public class GeopuntoEstructura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "geopunto_id", nullable = false)
    private Geopunto geopunto;

    @ManyToOne
    @JoinColumn(name = "estructura_id", nullable = false)
    private Estructura estructura;

    private String Circuito;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Geopunto getGeopunto() {
        return geopunto;
    }

    public void setGeopunto(Geopunto geopunto) {
        this.geopunto = geopunto;
    }

    public Estructura getEstructura() {
        return estructura;
    }

    public void setEstructura(Estructura estructura) {
        this.estructura = estructura;
    }

    public String getCircuito() {
        return Circuito;
    }

    public void setCircuito(String circuito) {
        Circuito = circuito;
    }
}

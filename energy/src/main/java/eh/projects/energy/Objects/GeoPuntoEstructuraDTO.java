package eh.projects.energy.Objects;

import eh.projects.energy.Entitys.Estructura;
import eh.projects.energy.Entitys.Geopunto;

public class GeoPuntoEstructuraDTO {
    private  Long id;
    private Geopunto geopunto;
    private Estructura estructura;
    private String circuito;

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
        return circuito;
    }

    public void setCircuito(String circuito) {
        this.circuito = circuito;
    }

    public GeoPuntoEstructuraDTO(Long id, Geopunto geopunto, Estructura estructura, String circuito) {
        this.id = id;
        this.geopunto = geopunto;
        this.estructura = estructura;
        this.circuito = circuito;
    }

    public GeoPuntoEstructuraDTO() {
    }
}

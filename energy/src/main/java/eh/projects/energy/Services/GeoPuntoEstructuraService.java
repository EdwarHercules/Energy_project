package eh.projects.energy.Services;

import eh.projects.energy.Entitys.Estructura;
import eh.projects.energy.Entitys.Geopunto;
import eh.projects.energy.Entitys.GeopuntoEstructura;
import eh.projects.energy.Objects.GeoPuntoEstructuraDTO;
import eh.projects.energy.Repositories.EstructurasRepository;
import eh.projects.energy.Repositories.GeoPuntoEstructuraRepository;
import eh.projects.energy.Repositories.GeoPuntoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GeoPuntoEstructuraService {
    private static final Logger logger = LoggerFactory.getLogger(GeoPuntoEstructuraService.class);

    @Autowired
    private GeoPuntoEstructuraRepository geoPuntoEstructuraRepository;

    @Autowired
    private EstructurasRepository estructurasRepository;

    @Autowired
    private GeoPuntoRepository  geoPuntoRepository;


    
    public List<GeoPuntoEstructuraDTO> getAll() {
        List<GeopuntoEstructura> geopuntoEstructuras =geoPuntoEstructuraRepository.findAll();
        return geopuntoEstructuras.stream().map(this::convertToGeoPuntoEstructuraDTO).collect(Collectors.toList());
    }

    public Optional<GeoPuntoEstructuraDTO> getPerID(Long id) {
        Optional<GeopuntoEstructura> geopuntoEstructuras =geoPuntoEstructuraRepository.findById(id);
        return geopuntoEstructuras.map(this::convertToGeoPuntoEstructuraDTO);
    }

    public GeoPuntoEstructuraDTO insertarEstructuraEnGeoPunto(Long geoPuntoId, Long estructuraId, String circuito) {
        // Verificar si la estructura existe y está asociada con el proyecto
        Estructura estructura = estructurasRepository.findById(estructuraId)
                .orElseThrow(() -> new RuntimeException("Estructura no encontrada con ID: " + estructuraId));

        Geopunto geopunto = geoPuntoRepository.findById(geoPuntoId)
                .orElseThrow(() -> new RuntimeException("Geopunto no encontrado con ID: " + geoPuntoId));


        // Crear la nueva asociación entre el geopunto y la estructura
        GeopuntoEstructura geopuntoEstructura = new GeopuntoEstructura();
        geopuntoEstructura.setGeopunto(geopunto);
        geopuntoEstructura.setEstructura(estructura);
        geopuntoEstructura.setCircuito(circuito);

        // Guardar la relación en la base de datos
        GeopuntoEstructura saveGeoPuntoEstructura = geoPuntoEstructuraRepository.save(geopuntoEstructura);

        // Convertir y devolver el DTO correspondiente
        return convertToGeoPuntoEstructuraDTO(saveGeoPuntoEstructura);
    }


    public GeoPuntoEstructuraDTO updateGeoPuntoEstructuraDTO(Long id, GeoPuntoEstructuraDTO objectGeoPuntoEstructuraDTOupdate) {
        //logic for update
        if (geoPuntoEstructuraRepository.existsById(id)) {
            GeopuntoEstructura geopuntoEstructuras =geoPuntoEstructuraRepository.findById(id).
                    orElseThrow(() -> new RuntimeException("No se encontro el material de la estructura"));

            GeopuntoEstructura geopuntoEstructurasUpdate = geoPuntoEstructuraRepository.save( geopuntoEstructuras);
            return convertToGeoPuntoEstructuraDTO(geopuntoEstructurasUpdate);
        } else {
            throw new RuntimeException("Material no encontrado para la estructura con ID: " + id);
        }
    }



    public void deleteId(Long id) {
        geoPuntoEstructuraRepository.deleteById(id);
    }

    private GeoPuntoEstructuraDTO convertToGeoPuntoEstructuraDTO(GeopuntoEstructura geopuntoEstructuras) {
        return new GeoPuntoEstructuraDTO(
                geopuntoEstructuras.getId(),
                geopuntoEstructuras.getGeopunto(),
                geopuntoEstructuras.getEstructura(),
                geopuntoEstructuras.getCircuito()
        );
    }

}

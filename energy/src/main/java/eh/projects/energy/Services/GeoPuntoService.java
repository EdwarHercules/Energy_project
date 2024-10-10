package eh.projects.energy.Services;

import eh.projects.energy.Entitys.Geopunto;
import eh.projects.energy.Entitys.Proyecto;
import eh.projects.energy.Objects.GeoPuntoDTO;
import eh.projects.energy.Repositories.GeoPuntoRepository;
import eh.projects.energy.Repositories.ProyectoRepository;
import org.locationtech.proj4j.ProjCoordinate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GeoPuntoService {
    private static final Logger logger = LoggerFactory.getLogger(GeoPuntoService.class);

    @Autowired
    private GeoPuntoRepository geoPuntoRepository;

    @Autowired
    private ProyectoRepository proyectorepository;

    @Autowired
    private CoordenadaService coordenadaService;


    public List<GeoPuntoDTO> getAll() {
        List<Geopunto> geopuntos =geoPuntoRepository.findAll();
        return geopuntos.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<GeoPuntoDTO> getPerID(Long id) {
        Optional<Geopunto> geopuntos =geoPuntoRepository.findById(id);
        return geopuntos.map(this::convertToDTO);
    }

    public GeoPuntoDTO crearProyectoNuevoPorUsuario(Long id, GeoPuntoDTO dto) {
        Proyecto proyecto = proyectorepository.findById(id).orElseThrow(() -> new RuntimeException("No se encontro el proyecto"));

        Geopunto geoPunto = new Geopunto();
        geoPunto.setLatitud(dto.getLatitud());
        geoPunto.setLongitud(dto.getLongitud());
        geoPunto.setDescripcion(dto.getDescripcion());

        // Convertir las coordenadas geográficas a UTM
        ProjCoordinate coordenadasUTM = coordenadaService.convertirGeograficaAUTM(dto.getLatitud(), dto.getLongitud());
        geoPunto.setUtm_x(BigDecimal.valueOf(coordenadasUTM.x));
        geoPunto.setUtm_y(BigDecimal.valueOf(coordenadasUTM.y));

        Geopunto savedGeoPunto = geoPuntoRepository.save(geoPunto);

        GeoPuntoDTO responseDTO = convertToDTO(savedGeoPunto);

        return responseDTO;
    }

    public GeoPuntoDTO updateDTO(Long id, GeoPuntoDTO objectDTOupdate) {
        //logic for update
        if (geoPuntoRepository.existsById(id)) {
            Geopunto geopuntos =geoPuntoRepository.findById(id).
                    orElseThrow(() -> new RuntimeException("No se encontro el material de la estructura"));

            Geopunto classUpdate = geoPuntoRepository.save(geopuntos);
            return convertToDTO(classUpdate);
        } else {
            throw new RuntimeException("Material no encontrado para la estructura con ID: " + id);
        }
    }


    public void deleteId(Long id) {
        geoPuntoRepository.deleteById(id);
    }

    private GeoPuntoDTO convertToDTO(Geopunto geopunto) {
        return new GeoPuntoDTO(
                geopunto.getId(),
                geopunto.getProyecto(),
                geopunto.getLatitud(),
                geopunto.getLongitud(),
                geopunto.getUtm_x(),
                geopunto.getUtm_y(),
                geopunto.getDescripcion()
        );
    }

}

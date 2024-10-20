package eh.projects.energy.Services;

import eh.projects.energy.Entitys.Geopunto;
import eh.projects.energy.Entitys.Proyecto;
import eh.projects.energy.Entitys.Usuario;
import eh.projects.energy.Objects.GeoPuntoDTO;
import eh.projects.energy.Repositories.GeoPuntoRepository;
import eh.projects.energy.Repositories.ProyectoRepository;
import org.locationtech.proj4j.ProjCoordinate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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

    public List<GeoPuntoDTO> getAllPerProyecto(Long id){
        List<Geopunto> geopuntos = geoPuntoRepository.findByProyectoId(id);
        return geopuntos.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<GeoPuntoDTO> getPerID(Long id) {
        Optional<Geopunto> geopuntos =geoPuntoRepository.findById(id);
        return geopuntos.map(this::convertToDTO);
    }

    public GeoPuntoDTO crearProyectoNuevoPorUsuario(Long id, GeoPuntoDTO dto) {
        logger.info(String.valueOf(dto));

        Proyecto proyecto = proyectorepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró el proyecto"));

        // Obtener todos los GeoPuntos existentes para el proyecto
        List<Geopunto> puntosExistentes = geoPuntoRepository.findByProyecto(proyecto);

        // Generar el nombre del nuevo GeoPunto
        String nombreGeoPunto = "P" + (puntosExistentes.size() + 1);

        // Crear nuevo GeoPunto
        Geopunto geoPunto = new Geopunto();
        geoPunto.setLatitud(dto.getLatitud());
        geoPunto.setLongitud(dto.getLongitud());
        geoPunto.setDescripcion(dto.getDescripcion());
        geoPunto.setProyecto(proyecto);
        geoPunto.setNombre(nombreGeoPunto);  // Asignar el nombre al geopunto

        // Convertir las coordenadas geográficas a UTM
        ProjCoordinate coordenadasUTM = coordenadaService.convertirGeograficaAUTM(dto.getLatitud(), dto.getLongitud());
        geoPunto.setUtm_x(BigDecimal.valueOf(coordenadasUTM.x));
        geoPunto.setUtm_y(BigDecimal.valueOf(coordenadasUTM.y));

        // Guardar el nuevo GeoPunto
        Geopunto savedGeoPunto = geoPuntoRepository.save(geoPunto);

        GeoPuntoDTO responseDTO = convertToDTO(savedGeoPunto);
        return responseDTO;
    }

    public GeoPuntoDTO crearGeoPuntoManualPorUsuario(Long id, GeoPuntoDTO dto) {
        // Obtener el proyecto asociado al ID
        Proyecto proyecto = proyectorepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró el proyecto"));

        // Obtener todos los GeoPuntos existentes para el proyecto
        List<Geopunto> puntosExistentes = geoPuntoRepository.findByProyecto(proyecto);

        // Generar el nombre del nuevo GeoPunto
        String nombreGeoPunto = "P" + (puntosExistentes.size() + 1);

        // Crear nuevo GeoPunto
        Geopunto geoPunto = new Geopunto();
        geoPunto.setDescripcion(dto.getDescripcion());
        geoPunto.setProyecto(proyecto);
        geoPunto.setNombre(nombreGeoPunto);  // Asignar el nombre al geopunto

        // Verificar si las coordenadas proporcionadas son geográficas o UTM
        if (dto.getLatitud() != null && dto.getLongitud() != null) {
            // Caso 1: Se proporcionaron coordenadas geográficas (latitud y longitud)
            geoPunto.setLatitud(dto.getLatitud());
            geoPunto.setLongitud(dto.getLongitud());

            // Convertir las coordenadas geográficas a UTM
            ProjCoordinate coordenadasUTM = coordenadaService.convertirGeograficaAUTM(dto.getLatitud(), dto.getLongitud());
            geoPunto.setUtm_x(BigDecimal.valueOf(coordenadasUTM.x));
            geoPunto.setUtm_y(BigDecimal.valueOf(coordenadasUTM.y));

        } else if (dto.getUtm_x() != null && dto.getUtm_y() != null) {
            // Caso 2: Se proporcionaron coordenadas UTM (utm_x y utm_y)
            geoPunto.setUtm_x(dto.getUtm_x());
            geoPunto.setUtm_y(dto.getUtm_y());

            // Convertir las coordenadas UTM a geográficas (latitud y longitud)
            ProjCoordinate coordenadasGeograficas = coordenadaService.convertirUTMAGeografica(dto.getUtm_x(), dto.getUtm_y());
            geoPunto.setLatitud(BigDecimal.valueOf(coordenadasGeograficas.y));
            geoPunto.setLongitud(BigDecimal.valueOf(coordenadasGeograficas.x));
        } else {
            throw new IllegalArgumentException("Se deben proporcionar coordenadas geográficas o UTM");
        }

        // Guardar el nuevo GeoPunto
        Geopunto savedGeoPunto = geoPuntoRepository.save(geoPunto);

        // Convertir a DTO y retornar la respuesta
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


    // Método que crea el archivo KMZ
    public File createKmzFile(Long proyectoId, List<GeoPuntoDTO> puntos) throws IOException {
        // Generar el contenido del archivo KML basado en los puntos
        String kmlContent = generateKmlContent(puntos);

        // Crear el archivo temporal KML
        File kmlFile = new File("proyecto_" + proyectoId + ".kml");
        try (FileOutputStream fos = new FileOutputStream(kmlFile)) {
            fos.write(kmlContent.getBytes());
        }

        // Crear el archivo KMZ, que es un archivo comprimido con formato ZIP
        File kmzFile = new File("proyecto_" + proyectoId + ".kmz");
        try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(kmzFile))) {
            // Añadir el archivo KML al archivo KMZ
            ZipEntry zipEntry = new ZipEntry(kmlFile.getName());
            zipOut.putNextEntry(zipEntry);
            zipOut.write(kmlContent.getBytes());
            zipOut.closeEntry();
        }

        return kmzFile;
    }

    // Método que genera el contenido del KML
    private String generateKmlContent(List<GeoPuntoDTO> puntos) {
        StringBuilder kml = new StringBuilder();

        // Cabecera del archivo KML
        kml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        kml.append("<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n");
        kml.append("<Document>\n");

        // Iterar sobre los puntos y añadir cada uno como un placemark en el KML
        for (GeoPuntoDTO punto : puntos) {
            kml.append("<Placemark>\n");
            kml.append("<name>").append(punto.getNombre()).append("</name>\n");
            kml.append("<description>").append(punto.getDescripcion()).append("</description>\n");
            kml.append("<Point>\n");
            kml.append("<coordinates>").append(punto.getLongitud())
                    .append(",").append(punto.getLatitud()).append(",0</coordinates>\n");
            kml.append("</Point>\n");
            kml.append("</Placemark>\n");
        }

        // Cerrar las etiquetas KML
        kml.append("</Document>\n");
        kml.append("</kml>");

        return kml.toString();
    }
    private GeoPuntoDTO convertToDTO(Geopunto geopunto) {
        return new GeoPuntoDTO(
                geopunto.getId(),
                geopunto.getProyecto(),
                geopunto.getLatitud(),
                geopunto.getLongitud(),
                geopunto.getUtm_x(),
                geopunto.getUtm_y(),
                geopunto.getDescripcion(),
                geopunto.getNombre()
        );
    }

}

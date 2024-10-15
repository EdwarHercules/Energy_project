package eh.projects.energy.Services;

import eh.projects.energy.Entitys.*;
import eh.projects.energy.Objects.ProyectoEstructuraDTO;
import eh.projects.energy.Repositories.EstMatRepository;
import eh.projects.energy.Repositories.EstructurasRepository;
import eh.projects.energy.Repositories.ProyectoEstructuraRepository;
import eh.projects.energy.Repositories.ProyectoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProyectoEstructuraService {

    private static final Logger logger = LoggerFactory.getLogger(ProyectoEstructuraService.class);

    @Autowired
    private ProyectoEstructuraRepository proyectoEstructuraRepository;

    @Autowired
    private EstMatRepository estMAtRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private EstructurasRepository estructurasRepository;



    public List<ProyectoEstructuraDTO> getAll() {
        List<ProyectoEstructura> proyectoEstructura =proyectoEstructuraRepository.findAll();
        return proyectoEstructura.stream().map(this::convertToProyectoEstructuraDTO).collect(Collectors.toList());
    }

    public Optional<ProyectoEstructuraDTO> getPerID(Long id) {
        Optional<ProyectoEstructura> proyectoEstructura =proyectoEstructuraRepository.findById(id);
        return proyectoEstructura.map(this::convertToProyectoEstructuraDTO);
    }

    public List<ProyectoEstructuraDTO> getAllPerProyecto(Long id){
        List<ProyectoEstructura> proyectoEstructuras = proyectoEstructuraRepository.findByProyectoId(id);
        return proyectoEstructuras.stream().map(this::convertToProyectoEstructuraDTO).collect(Collectors.toList());
    }

    public ProyectoEstructuraDTO insertarEstructurasPorProyecto(Long  proyectoId, Long estructuraId, ProyectoEstructuraDTO dto) {
        List<EstMat> estMats = estMAtRepository.findByEstructuraId(estructuraId);

        // Buscar proyecto y estructura
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + proyectoId));

        Estructura estructura = estructurasRepository.findById(estructuraId)
                .orElseThrow(() -> new RuntimeException("Estructura no encontrada con ID: " + estructuraId));


        ProyectoEstructura proyectoEstructura = new ProyectoEstructura();

        proyectoEstructura.setProyecto(proyecto);
        proyectoEstructura.setEstructura(estructura);
        proyectoEstructura.setCantidad(1);

        ProyectoEstructura saveProyectoEstructuraDTO = proyectoEstructuraRepository.save(proyectoEstructura);

        return convertToProyectoEstructuraDTO(saveProyectoEstructuraDTO);
    }

    public ProyectoEstructuraDTO updateProyectoEstructuraDTO(Long id, ProyectoEstructuraDTO objectProyectoEstructuraDTOupdate) {
        //logic for update
        if (proyectoEstructuraRepository.existsById(id)) {
            ProyectoEstructura proyectoEstructura =proyectoEstructuraRepository.findById(id).
                    orElseThrow(() -> new RuntimeException("No se encontro el material de la estructura"));

            ProyectoEstructura proyectoEstructuraUpdate = proyectoEstructuraRepository.save( proyectoEstructura);
            return convertToProyectoEstructuraDTO(proyectoEstructuraUpdate);
        } else {
            throw new RuntimeException("Material no encontrado para la estructura con ID: " + id);
        }
    }



    public void deleteId(Long id) {
        proyectoEstructuraRepository.deleteById(id);
    }

    private ProyectoEstructuraDTO convertToProyectoEstructuraDTO(ProyectoEstructura proyectoEstructura) {
        return new ProyectoEstructuraDTO(
                proyectoEstructura.getId(),
                proyectoEstructura.getProyecto(),
                proyectoEstructura.getEstructura(),
                proyectoEstructura.getCantidad()
        );
    }

}

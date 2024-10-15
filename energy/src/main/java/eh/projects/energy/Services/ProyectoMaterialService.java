package eh.projects.energy.Services;

import eh.projects.energy.Entitys.*;
import eh.projects.energy.Objects.ProyectoMaterialDTO;
import eh.projects.energy.Repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProyectoMaterialService {

    private static final Logger logger = LoggerFactory.getLogger(ProyectoMaterialService.class);

    @Autowired
    private ProyectoMaterialRepository proyectoMaterialRepository;

    @Autowired
    private EstMatRepository estMatRepository;
    
    @Autowired
    private ProyectoRepository proyectoRepository;


    @Autowired
    private EstructurasRepository estructurasRepository;
    
    @Autowired
    private MaterialRepository materialRepository;
    
    

    public List<ProyectoMaterialDTO> getAll() {
        List<ProyectoMaterial> proyectoMaterial =proyectoMaterialRepository.findAll();
        return proyectoMaterial.stream().map(this::convertToProyectoMaterialDTO).collect(Collectors.toList());
    }

    public Optional<ProyectoMaterialDTO> getPerID(Long id) {
        Optional<ProyectoMaterial> proyectoMaterial =proyectoMaterialRepository.findById(id);
        return proyectoMaterial.map(this::convertToProyectoMaterialDTO);
    }

    public List<ProyectoMaterialDTO> getAllDistinctPerProyecto(Long proyectoId) {
        // Obtener todos los materiales del proyecto
        List<ProyectoMaterial> proyectoMaterials = proyectoMaterialRepository.findByProyectoId(proyectoId);

        // Verificar si hay materiales asociados al proyecto
        if (proyectoMaterials.isEmpty()) {
            logger.warn("No se encontraron materiales para el proyecto con ID: {}", proyectoId);
            return List.of(); // Retornar una lista vacía si no hay materiales
        }

        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + proyectoId));

        // Agrupar por material y sumar las cantidades
        Map<Long, ProyectoMaterialDTO> materialesAgrupados = new HashMap<>();

        for (ProyectoMaterial proyectoMaterial : proyectoMaterials) {
            Long materialId = proyectoMaterial.getMaterial().getId();

            // Si el material ya está en el mapa, sumar la cantidad
            if (materialesAgrupados.containsKey(materialId)) {
                ProyectoMaterialDTO dtoExistente = materialesAgrupados.get(materialId);
                dtoExistente.setCantidad(dtoExistente.getCantidad() + proyectoMaterial.getCantidad());
            } else {
                // Si no está, crear una nueva entrada
                ProyectoMaterialDTO nuevoDto = new ProyectoMaterialDTO();
                nuevoDto.setProyecto(proyecto);  // Asignar el ID del proyecto
                nuevoDto.setMaterial(proyectoMaterial.getMaterial());  // Asignar el material
                nuevoDto.setCantidad(proyectoMaterial.getCantidad());  // Establecer cantidad
                nuevoDto.setUnidad(proyectoMaterial.getUnidad());  // Establecer unidad
                materialesAgrupados.put(materialId, nuevoDto);
            }
        }

        // Retornar la lista de DTOs
        return new ArrayList<>(materialesAgrupados.values());
    }


    public List<ProyectoMaterialDTO> getAllPerProyect(Long id){
        List<ProyectoMaterial> proyectoMaterials = proyectoMaterialRepository.findByProyectoId(id);
        return proyectoMaterials.stream().map(this::convertToProyectoMaterialDTO).collect(Collectors.toList());
    }

    public ProyectoMaterialDTO insertarMaterialesPorEstructuraEnProyecto(Long proyectoId, Long estructuraId, String voltaje) {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + proyectoId));

        List<EstMat> estMats = estMatRepository.findByEstructuraId(estructuraId);

        ProyectoMaterial saveProyectoMaterial = null;

        for (EstMat estMat: estMats) {
            ProyectoMaterial proyectoMaterial = new ProyectoMaterial();

            proyectoMaterial.setProyecto(proyecto);
            proyectoMaterial.setMaterial(estMat.getMaterial());

            // Asignar cantidad según el voltaje
            if ("34kva".equals(voltaje)){
                proyectoMaterial.setCantidad(estMat.getCantidad_mat_34kva());
            } else if ("13kva".equals(voltaje)) {
                proyectoMaterial.setCantidad(estMat.getCantidad_mat_18kva());
            } else {
                proyectoMaterial.setCantidad(estMat.getCantidad_mat());
            }

            proyectoMaterial.setUnidad(estMat.getUnidad());

            // Guardar el proyectoMaterial
            saveProyectoMaterial = proyectoMaterialRepository.save(proyectoMaterial);
        }

        // Convertir el último ProyectoMaterial guardado a DTO y devolverlo
        return convertToProyectoMaterialDTO(saveProyectoMaterial);
    }

    public ProyectoMaterialDTO updateProyectoMaterialDTO(Long id, ProyectoMaterialDTO objectProyectoMaterialDTOupdate) {
        //logic for update
        if (proyectoMaterialRepository.existsById(id)) {
            ProyectoMaterial proyectoMaterial =proyectoMaterialRepository.findById(id).
                    orElseThrow(() -> new RuntimeException("No se encontro el material de la estructura"));

            proyectoMaterial.setCantidad(objectProyectoMaterialDTOupdate.getCantidad());

            ProyectoMaterial proyectoMaterialUpdate = proyectoMaterialRepository.save( proyectoMaterial);
            return convertToProyectoMaterialDTO(proyectoMaterialUpdate);
        } else {
            throw new RuntimeException("Material no encontrado para la estructura con ID: " + id);
        }
    }


    public void deleteId(Long id) {
        proyectoMaterialRepository.deleteById(id);
    }

    private ProyectoMaterialDTO convertToProyectoMaterialDTO(ProyectoMaterial proyectoMaterial) {
        return new ProyectoMaterialDTO(
                proyectoMaterial.getId(),
                proyectoMaterial.getProyecto(),
                proyectoMaterial.getMaterial(),
                proyectoMaterial.getCantidad(),
                proyectoMaterial.getUnidad()
        );
    }


}

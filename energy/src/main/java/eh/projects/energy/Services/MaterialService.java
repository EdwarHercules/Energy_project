package eh.projects.energy.Services;

import eh.projects.energy.Entitys.Material;
import eh.projects.energy.Objects.MaterialDTO;
import eh.projects.energy.Repositories.MaterialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MaterialService {
    private static final Logger logger = LoggerFactory.getLogger(MaterialService.class);

    @Autowired
    private MaterialRepository materialRepository;


    public List<MaterialDTO> getAll() {
        List<Material> materials = materialRepository.findAll();
        return materials.stream().map(this::convertirDTO).collect(Collectors.toList());
    }

    public Optional<MaterialDTO> getPerID(Long id) {
        Optional<Material> material = materialRepository.findById(id);
        return material.map(this::convertirDTO);
    }

    public MaterialDTO materialupdateDTO(Long id, MaterialDTO materialDTOupdate) {
        //logic for update
        if (materialRepository.existsById(id)) {
            Material material = materialRepository.findById(id).orElseThrow(()->new RuntimeException("Material no encontrado con ID: "+ id));

            material.setCodigo(materialDTOupdate.getCodigo());
            material.setNombre(materialDTOupdate.getNombre());

            Material materialUpdate = materialRepository.save(material);
            return convertirDTO(materialUpdate);
        } else {
            throw new RuntimeException("Material no encontrado con ID: " + id);
        }
    }

    public void materialDelete(Long id) {
        materialRepository.deleteById(id);
    }

    private MaterialDTO convertirDTO(Material material){
        return new MaterialDTO(
                material.getId(),
                material.getCodigo(),
                material.getNombre()
        );
    }

}

package eh.projects.energy.Services;

import eh.projects.energy.Entitys.EstMat;
import eh.projects.energy.Objects.EstMatDTO;
import eh.projects.energy.Repositories.EstMatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EstMatService {
    private static final Logger logger = LoggerFactory.getLogger(EstMatService.class);

    @Autowired
    private EstMatRepository estMatRepository;


    public List<EstMatDTO> getAll() {
        List<EstMat> estMat =estMatRepository.findAll();
        return estMat.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<EstMatDTO> getPerID(Long id) {
        Optional<EstMat> estMat =estMatRepository.findById(id);
        return estMat.map(this::convertToDTO);
    }

    public EstMatDTO updateDTO(Long id, EstMatDTO objectDTOupdate) {
        //logic for update
        if(estMatRepository.existsById(id)){
            EstMat estMat = estMatRepository.findById(id).
                    orElseThrow(()-> new RuntimeException("No se encontro el material de la estructura"));

            estMat.setEstructura(objectDTOupdate.getEstructura());
            estMat.setMaterial(objectDTOupdate.getMaterial());
            estMat.setUnidad(objectDTOupdate.getUnidad());
            estMat.setCantidad_mat_34kva(objectDTOupdate.getCantidad_mat_34kva());
            estMat.setCantidad_mat_18kva(objectDTOupdate.getCantidad_mat_18kva());
            estMat.setCantidad_mat(objectDTOupdate.getCantidad_mat());

            EstMat estMatUpdate = estMatRepository.save(estMat);
            return convertToDTO(estMatUpdate);
        } else {
            throw new RuntimeException("Material no encontrado para la estructura con ID: "+ id);
        }
    }

    public void deleteId(Long id) {
        estMatRepository.deleteById(id);
    }

    private EstMatDTO convertToDTO(EstMat estMat) {
        return new EstMatDTO(
                estMat.getId(),
                estMat.getEstructura(),
                estMat.getMaterial(),
                estMat.getUnidad(),
                estMat.getCantidad_mat_34kva(),
                estMat.getCantidad_mat_18kva(),
                estMat.getCantidad_mat()
        );
    }

}

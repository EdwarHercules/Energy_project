package eh.projects.energy.Services;

import eh.projects.energy.Entitys.Estructura;
import eh.projects.energy.Objects.EstructurasDTO;
import eh.projects.energy.Repositories.EstructurasRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EstructurasService {
    private static final Logger logger = LoggerFactory.getLogger(EstructurasService.class);

    @Autowired
    private EstructurasRepository estructurasRepository;

    public List<EstructurasDTO> getAll() {
        List<Estructura> estructuras =estructurasRepository.findAll();
        return estructuras.stream().map(this::convertirDTO).collect(Collectors.toList());
    }

    public Optional<EstructurasDTO> getPerID(Long id) {
        Optional<Estructura> estructurasDTO = estructurasRepository.findById(id);
        return estructurasDTO.map(this::convertirDTO);
    }

    public EstructurasDTO estructuraUpdate (Long id, EstructurasDTO estructuraDTOupdate) {
        //logic for update
        if (estructurasRepository.existsById(id)){
            Estructura estructura = estructurasRepository.findById(id).orElseThrow(() -> new RuntimeException("Estructura no encontrada con id: " + id));

            estructura.setCodigo(estructuraDTOupdate.getCodigo());
            estructura.setNombre(estructuraDTOupdate.getNombre());

            Estructura estructuraUpdate = estructurasRepository.save(estructura);

            return convertirDTO(estructuraUpdate);
        } else  {
            throw new RuntimeException("Estructura no encontrada con ID: " + id);
        }

    }

    public void estructuraDelete (Long id) {
        estructurasRepository.deleteById(id);
    }

    private EstructurasDTO convertirDTO(Estructura estructura){
        return new EstructurasDTO(
                estructura.getId(),
                estructura.getCodigo(),
                estructura.getNombre()
        );
    }

}

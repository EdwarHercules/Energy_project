package eh.projects.energy.Services;

import eh.projects.energy.Entitys.Proyecto;
import eh.projects.energy.Entitys.Usuario;
import eh.projects.energy.Objects.ProyectoDTO;
import eh.projects.energy.Repositories.ProyectoRepository;
import eh.projects.energy.Repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProyectoService {
    private static final Logger logger = LoggerFactory.getLogger(ProyectoService.class);

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;



    public ProyectoDTO crearProyectoNuevoPorUsuario(String email, ProyectoDTO proyectoDTO){
        Usuario usuario = usuarioRepository.findByEmail(email);

        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(proyectoDTO.getNombre());
        proyecto.setDescripcion(proyectoDTO.getDescripcion());
        proyecto.setFecha_inicio(proyectoDTO.getFecha_inicio());
        proyecto.setEstado(proyectoDTO.getEstado());
        proyecto.setResponable(usuario);

        Proyecto saveProyecto = proyectoRepository.save(proyecto);

        return convertirDTO(saveProyecto);
    }

    public List<ProyectoDTO> getAll() {
        List<Proyecto> proyectos =proyectoRepository.findAll();
        return proyectos.stream().map(this::convertirDTO).collect(Collectors.toList());
    }

    public Optional<ProyectoDTO> getPerID(Long id) {
        Optional <Proyecto> proyecto =proyectoRepository.findById(id);
        return proyecto.map(this::convertirDTO);
    }

    public ProyectoDTO updateDTO(Long id, ProyectoDTO proyectoDTOUpdate) {
        //logic for update
        if (proyectoRepository.existsById(id)){
            logger.info("Actualizando Proyecto");
            Proyecto proyecto = proyectoRepository.findById(id).orElseThrow(() -> new RuntimeException("Proyecto no encontrado" + id));

            proyecto.setNombre(proyectoDTOUpdate.getNombre());
            proyecto.setDescripcion(proyectoDTOUpdate.getDescripcion());
            proyecto.setEstado(proyectoDTOUpdate.getEstado());
            proyecto.setFecha_inicio(proyectoDTOUpdate.getFecha_inicio());
            proyecto.setFecha_fin(proyecto.getFecha_fin());
            proyecto.setResponable(proyectoDTOUpdate.getResponsable());

            Proyecto updateProyecto = proyectoRepository.save(proyecto);

            return convertirDTO(updateProyecto);
        } else {
            throw new RuntimeException("Proyecto no encontrado con ID: " + id);
        }
    }

    public void deleteProyecto(Long id) {
        proyectoRepository.deleteById(id);
    }


    private ProyectoDTO convertirDTO(Proyecto proyecto){
        return new ProyectoDTO(
                proyecto.getId(),
                proyecto.getNombre(),
                proyecto.getDescripcion(),
                proyecto.getFecha_inicio(),
                proyecto.getFecha_fin(),
                proyecto.getEstado(),
                proyecto.getResponable()

        );
    }
}

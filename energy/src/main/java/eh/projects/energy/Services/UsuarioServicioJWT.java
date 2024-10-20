package eh.projects.energy.Services;

import eh.projects.energy.Entitys.Rol;
import eh.projects.energy.Entitys.Usuario;
import eh.projects.energy.Objects.UsuarioDTO;
import eh.projects.energy.Repositories.Rolrepository;
import eh.projects.energy.Repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioServicioJWT {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioServicioJWT.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private Rolrepository rolRepository;

    // Obtener todos los roles
    public List<Rol> getAllRoles() {
        return rolRepository.findAll();
    }

    // Obtener todos los usuarios con sus roles
    public List<UsuarioDTO> getAll() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(this::convertToUsuarioDTO)
                .collect(Collectors.toList());
    }

    // Obtener usuario por ID junto con sus roles
    public Optional<UsuarioDTO> getPerID(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(this::convertToUsuarioDTO);
    }

    // Actualizar usuario
    public UsuarioDTO updateUsuarioDTO(Long id, UsuarioDTO objectUsuarioDTOupdate) {
        if (usuarioRepository.existsById(id)) {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Actualizar información del usuario (se puede ajustar según necesidades)
            usuario.setNombre(objectUsuarioDTOupdate.getNombre());
            usuario.setEmail(objectUsuarioDTOupdate.getEmail());

            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            return convertToUsuarioDTO(usuarioActualizado);
        } else {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }

    // Eliminar usuario por ID
    public void deleteId(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Asignar un nuevo rol a un usuario
    public UsuarioDTO asignarRol(Long usuarioId, Long rolId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        usuario.getRoles().add(rol);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return convertToUsuarioDTO(usuarioActualizado);
    }

    // Eliminar un rol de un usuario
    public UsuarioDTO eliminarRol(Long usuarioId, String rolId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Rol rol = rolRepository.findByNombre(rolId);

        usuario.getRoles().remove(rol); // Esto elimina la relación
        usuarioRepository.save(usuario); // Guardar los cambios
        return convertToUsuarioDTO(usuario);
    }

    // Conversión de entidad Usuario a DTO
    private UsuarioDTO convertToUsuarioDTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.isEstado(),
                usuario.getRoles().stream()
                        .map(Rol::getNombre)  // Convertir los roles a una lista de nombres de roles
                        .collect(Collectors.toList())  // Convertir el Stream en una lista de String

        );
    }
}

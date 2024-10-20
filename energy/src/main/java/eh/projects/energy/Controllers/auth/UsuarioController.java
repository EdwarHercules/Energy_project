package eh.projects.energy.Controllers.auth;

import eh.projects.energy.Entitys.Rol;
import eh.projects.energy.Objects.UsuarioDTO;
import eh.projects.energy.Services.UsuarioServicioJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioServicioJWT usuarioServicioJWT;

    // Obtener todos los usuarios con sus roles
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        List<UsuarioDTO> usuarios = usuarioServicioJWT.getAll();
        return ResponseEntity.ok(usuarios);
    }

    // Obtener un usuario por ID con sus roles
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioPorID(@PathVariable Long id) {
        Optional<UsuarioDTO> usuario = usuarioServicioJWT.getPerID(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener todos los roles
    @GetMapping("/roles")
    public List<Rol> getAllRoles() {
        return usuarioServicioJWT.getAllRoles();
    }

    // Asignar un nuevo rol a un usuario
    @PostMapping("/{id}/roles/{rolId}")
    public ResponseEntity<UsuarioDTO> asignarRolAUsuario(@PathVariable Long id, @PathVariable Long rolId) {
        try {
            UsuarioDTO usuarioActualizado = usuarioServicioJWT.asignarRol(id, rolId);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Eliminar un rol de un usuario
    @DeleteMapping("/{id}/roles/{rolId}")
    public ResponseEntity<UsuarioDTO> eliminarRolDeUsuario(@PathVariable Long id, @PathVariable String rolId) {
        try {
            UsuarioDTO usuarioActualizado = usuarioServicioJWT.eliminarRol(id, rolId);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Actualizar un usuario
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO usuarioActualizado = usuarioServicioJWT.updateUsuarioDTO(id, usuarioDTO);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioServicioJWT.deleteId(id);
        return ResponseEntity.noContent().build();
    }
}

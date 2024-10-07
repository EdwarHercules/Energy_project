package eh.projects.energy.Services;


import eh.projects.energy.Entitys.Usuario;
import eh.projects.energy.Objects.UsuarioRegistroDTO;
import org.springframework.security.core.userdetails.UserDetailsService;


public interface UsuarioServicio extends UserDetailsService {
    public Usuario guardar(UsuarioRegistroDTO usuarioRegistroDTO);
}

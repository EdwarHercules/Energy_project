package eh.projects.energy.Services;


import eh.projects.energy.Entitys.Rol;
import eh.projects.energy.Entitys.Usuario;
import eh.projects.energy.Objects.UsuarioRegistroDTO;
import eh.projects.energy.Repositories.Rolrepository;
import eh.projects.energy.Repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServicioImpl implements  UsuarioServicio{
    private static final Logger logger = LoggerFactory.getLogger(UsuarioServicioImpl.class);

    @Autowired
    private final UsuarioRepository usuarioRepositorio;
    @Autowired
    private final Rolrepository rolRepositorio;

    public UsuarioServicioImpl(UsuarioRepository usuarioRepositorio, Rolrepository rolRepositorio)
    {
        this.usuarioRepositorio = usuarioRepositorio;
        this.rolRepositorio = rolRepositorio;
    }

    @Override
    public Usuario guardar(UsuarioRegistroDTO usuarioRegistroDTO) {
        if (usuarioYaExiste(usuarioRegistroDTO.getEmail())) {
            throw new RuntimeException("El usuario ya existe");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioRegistroDTO.getNombre());
        usuario.setPassword(passwordEncoder.encode(usuarioRegistroDTO.getPassword()));
        usuario.setEmail(usuarioRegistroDTO.getEmail());
        usuario.setEstado(true);

        // Buscar los roles existentes
        List<Rol> rolesPredeterminados = rolRepositorio.findAllByNombreIn(
                List.of("ROLE_USER_PRUEBA", "ROLE_USER_BASIC")
        );

        // Asignar los roles encontrados al usuario
        usuario.setRoles(rolesPredeterminados);

        // Guardar en la base de datos
        Usuario savedUsuario = usuarioRepositorio.save(usuario);

        return savedUsuario;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepositorio.findByEmail(username);
        if (usuario == null){
            throw new UsernameNotFoundException("Usuario o password invalidos");
        }
        return new User(usuario.getEmail(),usuario.getPassword(), getAuthority(usuario));
    }

    private  Collection<? extends GrantedAuthority> getAuthority(Usuario usuario) {
        return usuario.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getNombre()))
                .collect(Collectors.toList());
    }
    public boolean usuarioYaExiste(String email) {
        return usuarioRepositorio.findByEmail(email) != null;
    }

    public Usuario findByNombreUsuario(String nombreUsuario) {
        return usuarioRepositorio.findByEmail(nombreUsuario);
    }

}

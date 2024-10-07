package eh.projects.energy.Services;


import eh.projects.energy.Entitys.Rol;
import eh.projects.energy.Entitys.Usuario;
import eh.projects.energy.Objects.UsuarioRegistroDTO;
import eh.projects.energy.Repositories.Rolrepository;
import eh.projects.energy.Repositories.UsuarioRepository;
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
            // Manejar el caso de un usuario existente, por ejemplo, lanzando una excepción
            throw new RuntimeException("El usuario ya existe");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioRegistroDTO.getNombre());
        usuario.setPassword(passwordEncoder.encode(usuarioRegistroDTO.getPassword()));
        usuario.setEmail(usuarioRegistroDTO.getEmail());
        usuario.setEstado(usuarioRegistroDTO.isEstado());

        // Crear un nuevo rol para el usuario con el nombre "ROLE_USER"
        Rol rolUsuario = new Rol();
        rolUsuario.setNombre("ROLE_USER_PRUEBA");
        rolUsuario.setDescripcion("Rol de usuario por defecto");
        rolRepositorio.save(rolUsuario);

        // Asignar roles al usuario (en este caso, solo ROLE_USER)
        usuario.setRoles(Collections.singletonList(rolUsuario));

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

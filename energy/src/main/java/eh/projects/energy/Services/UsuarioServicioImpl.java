package eh.projects.energy.Services;

import com.portfolio.gestor.DTO.ClienteDTO;
import com.portfolio.gestor.DTO.CuentaDTO;
import com.portfolio.gestor.DTO.UsuarioRegistroDTO;
import com.portfolio.gestor.entity.*;
import com.portfolio.gestor.repository.*;
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
    private final PersonaRepository personaRepositorio;

    @Autowired
    private final ClienteRepository clienteRepositorio;

    @Autowired
    private final CuentaRepository cuentaRepository;
    @Autowired
    private final Rolrepository rolRepositorio;

    public UsuarioServicioImpl(UsuarioRepository usuarioRepositorio, PersonaRepository personaRepositorio, ClienteRepository clienteRepositorio, CuentaRepository cuentaRepository, Rolrepository rolRepositorio)
    {
        this.usuarioRepositorio = usuarioRepositorio;
        this.personaRepositorio = personaRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.cuentaRepository = cuentaRepository;
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
        rolUsuario.setNombre("ROLE_USER");
        rolUsuario.setDescripcion("Rol de usuario por defecto");
        rolRepositorio.save(rolUsuario);

        // Asignar roles al usuario (en este caso, solo ROLE_USER)
        usuario.setRoles(Collections.singletonList(rolUsuario));

        Persona persona = new Persona();
        persona.setNombre(usuarioRegistroDTO.getNombre());
        persona.setGenero(usuarioRegistroDTO.getGenero());
        persona.setEdad(usuarioRegistroDTO.getEdad());
        persona.setIdentificacion(usuarioRegistroDTO.getIdentificacion());
        persona.setDireccion(usuarioRegistroDTO.getDireccion());
        persona.setTelefono(usuarioRegistroDTO.getTelefono());
        persona.setUsuario(usuario); // Establecer la relación bidireccional

        Cliente cliente = new Cliente();
        cliente.setPassword(passwordEncoder.encode(usuarioRegistroDTO.getPassword()));
        cliente.setEstado(usuarioRegistroDTO.isEstado());
        cliente.setPersona(persona); // Establecer la relación bidireccional

        usuario.setPersona(persona); // Establecer la relación bidireccional

        // Guardar en la base de datos
        Usuario savedUsuario = usuarioRepositorio.save(usuario);
        personaRepositorio.save(persona); // No necesitamos guardar la persona explícitamente si usamos CascadeType.ALL
        clienteRepositorio.save(cliente); // No necesitamos guardar el cliente explícitamente si usamos CascadeType.ALL

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

    public String obtenerNombrePersonaPorEmail(String email) {
        Usuario usuario = usuarioRepositorio.findByEmail(email);
        if (usuario == null || usuario.getPersona() == null) {
            throw new UsernameNotFoundException("Usuario no encontrado o persona asociada no encontrada");
        }
        return usuario.getPersona().getNombre();
    }


    public List<CuentaDTO> obtenerCuentasPorEmailUsuario(String email) {
        Usuario usuario = usuarioRepositorio.findByEmail(email);
        if (usuario == null || usuario.getPersona() == null || usuario.getPersona().getId() == null) {
            throw new UsernameNotFoundException("Usuario no encontrado o datos de cuenta asociada no encontrados");
        }
        Cliente cliente = clienteRepositorio.findByPersonaId(usuario.getPersona().getId());
        List<Cuenta> cuenta = cuentaRepository.findByClienteId(cliente.getId());
        return cuenta.stream()
                .map(this::convertirACuentaDTO)
                .collect(Collectors.toList());
    }

    private CuentaDTO convertirACuentaDTO(Cuenta cuenta) {
        CuentaDTO cuentaDTO = new CuentaDTO();
        cuentaDTO.setId(cuenta.getId());
        cuentaDTO.setNumeroCuenta(cuenta.getNumeroCuenta());
        cuentaDTO.setTipoCuenta(cuenta.getTipoCuenta());
        cuentaDTO.setSaldoInicial(cuenta.getSaldoInicial());
        cuentaDTO.setEstado(cuenta.getEstado());
        cuentaDTO.setClienteDTO(convertirAClienteDTO(cuenta.getCliente()));
        return cuentaDTO;
    }

    private ClienteDTO convertirAClienteDTO(Cliente cliente) {
        ClienteDTO clienteDTO = new ClienteDTO();
        clienteDTO.setId(cliente.getId());
        clienteDTO.setNombre(cliente.getPersona().getNombre());
        clienteDTO.setGenero(cliente.getPersona().getGenero());
        clienteDTO.setEdad(cliente.getPersona().getEdad());
        clienteDTO.setIdentificacion(cliente.getPersona().getIdentificacion());
        clienteDTO.setDireccion(cliente.getPersona().getDireccion());
        clienteDTO.setTelefono(cliente.getPersona().getTelefono());
        clienteDTO.setPassword(cliente.getPassword());
        return clienteDTO;
    }
}

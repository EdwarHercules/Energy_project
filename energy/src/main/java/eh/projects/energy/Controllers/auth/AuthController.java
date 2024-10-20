package eh.projects.energy.Controllers.auth;

import eh.projects.energy.Entitys.Rol;
import eh.projects.energy.Entitys.Usuario;
import eh.projects.energy.JWT.JwtRequest;
import eh.projects.energy.JWT.JwtResponse;
import eh.projects.energy.JWT.JwtUtil;
import eh.projects.energy.Objects.UsuarioRegistroDTO;
import eh.projects.energy.Services.UsuarioServicio;
import eh.projects.energy.Services.UsuarioServicioImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private UsuarioServicioImpl usuarioservicioImpl;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRegistroDTO registroDTO) {
        try {
            // Validación de entrada (opcional, pero recomendable)
            if (registroDTO.getEmail() == null || registroDTO.getEmail().isEmpty() ||
                    registroDTO.getPassword() == null || registroDTO.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("El email y la contraseña son obligatorios.");
            }

            // Registro del usuario
            usuarioServicio.guardar(registroDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            // Manejo de excepciones específicas del servicio
            return ResponseEntity.badRequest().body("Error en el registro: " + e.getMessage());
        } catch (Exception e) {
            // Manejo de cualquier otra excepción
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> crearTokenDeAutenticacion(@RequestBody JwtRequest request) {
        try {
            // Autenticación del usuario
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Cargar detalles del usuario
            final UserDetails userDetails = usuarioServicio.loadUserByUsername(request.getUsername());

            // Obtener los roles del usuario
            Usuario usuario = usuarioservicioImpl.findByNombreUsuario(request.getUsername());
            List<String> roles = usuario.getRoles().stream()
                    .map(Rol::getNombre)
                    .collect(Collectors.toList());

            logger.info("Roles asignados al token: " + roles);

            // Generar token JWT con roles
            final String jwt = jwtTokenUtil.generarToken(userDetails, roles);

            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (BadCredentialsException e) {
            logger.info(String.valueOf(e));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
        } catch (Exception e) {
            logger.info(String.valueOf(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Lógica para invalidar el token
        return ResponseEntity.ok("Logout exitoso");
    }

}

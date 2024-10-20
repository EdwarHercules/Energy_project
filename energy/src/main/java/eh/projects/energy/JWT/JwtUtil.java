package eh.projects.energy.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    public String extraerUsername(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    public Date extraerFechaExpiracion(String token) {
        return extraerClaim(token, Claims::getExpiration);
    }

    public <T> T extraerClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extraerTodosClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extraerTodosClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Token inválido o expirado", e);
        }
    }


    private Boolean esTokenExpirado(String token) {
        return extraerFechaExpiracion(token).before(new Date());
    }

    // Método para generar token con roles
    public String generarToken(UserDetails userDetails, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);  // Incluir los roles en los claims
        return crearToken(claims, userDetails.getUsername());
    }

    // Crear token JWT con claims adicionales
    private String crearToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public Boolean validarToken(String token, UserDetails userDetails) {
        final String username = extraerUsername(token);
        return (username.equals(userDetails.getUsername()) && !esTokenExpirado(token));
    }
}

package eh.projects.energy.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    private SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    ; // Usa una clave secreta compleja y guárdala de manera segura

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

    public String generarToken(UserDetails userDetails) {
        return crearToken(userDetails.getUsername());
    }

    private String crearToken(String subject) {
        return Jwts.builder().setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas de validez
                .signWith(SignatureAlgorithm.HS256, secretKey).compact();
    }

    public Boolean validarToken(String token, UserDetails userDetails) {
        final String username = extraerUsername(token);
        return (username.equals(userDetails.getUsername()) && !esTokenExpirado(token));
    }
}

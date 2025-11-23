package pasquale.alberico.recipefinder.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.exceptions.UnauthorizedException;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JWTTools {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ✔ unico metodo per creare il token, con ruolo incluso
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✔ verifica validità token
    public void verifyToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
        } catch (Exception ex) {
            throw new UnauthorizedException("Token invalido o scaduto!");
        }
    }

    // ✔ estrae ID utente
    public Long extractIdFromToken(String token) {
        return Long.parseLong(
                Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getSubject()
        );
    }

    // ✔ estrae ruolo (se ti serve)
    public String extractRole(String token) {
        return (String) Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role");
    }
}

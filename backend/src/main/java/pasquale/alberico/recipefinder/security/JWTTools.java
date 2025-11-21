package pasquale.alberico.recipefinder.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.exceptions.UnauthorizedException;

import java.util.Date;

@Component
public class JWTTools {

    @Value("${jwt.secret}")
    private String secret;

    public String createToken(User user) {
        return Jwts.builder()
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .subject(String.valueOf(user.getId()))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }

    public void verifyToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseSignedClaims(token); // ✔ verifica firma + payload
        } catch (Exception ex) {
            throw new UnauthorizedException("Token invalido o scaduto!");
        }
    }


    public Long extractIdFromToken(String token) {
        return Long.parseLong(
                Jwts.parser()
                        .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getSubject()
        );
    }

}
//Ora la catena sarà:
//Chiave JWT valida → token valido
//verifyToken() corretto → ti fa passare
//apiFetch invia il token giusto → niente più 403
//favorites FUNZIONA
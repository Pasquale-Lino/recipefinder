package pasquale.alberico.recipefinder.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.exceptions.UnauthorizedException;
import pasquale.alberico.recipefinder.repositories.UserRepository;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("=== JWT DEBUG START ===");
        System.out.println("Authorization header: " + request.getHeader("Authorization"));
        System.out.println("=== JWT DEBUG END ===");

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Token mancante o malformato!");
        }

        String token = authHeader.replace("Bearer ", "");

        jwtTools.verifyToken(token);

        Long userId = jwtTools.extractIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Utente non trovato per questo token!"));

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());


        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return new AntPathMatcher().match("/api/auth/**", request.getServletPath());
    }
}

package pasquale.alberico.recipefinder.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.exceptions.UnauthorizedException;
import pasquale.alberico.recipefinder.repositories.UserRepository;

import java.io.IOException;
import java.util.List;

@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Nessun token → lascio passare, ci penserà SecurityConfig
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.replace("Bearer ", "");

        jwtTools.verifyToken(token);

        Long userId = jwtTools.extractIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Utente non trovato per questo token!"));

        GrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name()); // ROLE_ADMIN / ROLE_USER

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(user, null, List.of(authority));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return new AntPathMatcher().match("/api/auth/**", request.getServletPath());
    }
}

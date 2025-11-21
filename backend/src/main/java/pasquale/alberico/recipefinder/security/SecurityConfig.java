package pasquale.alberico.recipefinder.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JWTFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                // 🔥 Inseriamo il filtro JWT PRIMA dell’authentication filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .authorizeHttpRequests(auth -> auth

                        // -----------------------------
                        // 🔓 ENDPOINT PUBBLICI
                        // -----------------------------
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/verify").permitAll()
                        .requestMatchers("/api/auth/verify-code").permitAll()

                        // endpoint utile solo per testing
                        .requestMatchers("/api/auth/delete/**").permitAll()

                        // test email
                        .requestMatchers("/api/test-email").permitAll()

                        // ricette totalmente pubbliche
                        .requestMatchers("/api/recipes/**").permitAll()

                        // -----------------------------
                        // 🔐 ENDPOINT PROTETTI
                        // -----------------------------
                        .requestMatchers("/api/favorites/**").authenticated()

                        // -----------------------------
                        // 🔒 TUTTO IL RESTO RICHIEDE LOGIN
                        // -----------------------------
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // CONFIGURAZIONE CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

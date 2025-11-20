package pasquale.alberico.recipefinder.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.enums.Role;
import pasquale.alberico.recipefinder.repositories.UserRepository;
import pasquale.alberico.recipefinder.services.EmailService;
import pasquale.alberico.recipefinder.security.JWTTools;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JWTTools jwtTools;  // ⬅ AGGIUNGERE QUESTO

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ⬅ AGGIUNGIAMO jwtTools AL COSTRUTTORE
    public AuthController(UserRepository userRepository, EmailService emailService, JWTTools jwtTools) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtTools = jwtTools;
    }

    // 🧑‍💻 Registrazione con token email
    @PostMapping("/register")
    public String register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return "⚠️ Utente già registrato con questa email";
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setRole(Role.USER);
        newUser.setVerificationToken(UUID.randomUUID().toString());
        newUser.setVerified(false);

        userRepository.save(newUser);

        emailService.sendWelcomeEmail(newUser.getEmail(), newUser.getUsername());
        emailService.sendVerificationEmail(newUser.getEmail(), newUser.getVerificationToken());

        return "✅ Registrazione completata! Controlla la tua email per confermare.";
    }

    // ✉️ Verifica email
    @GetMapping("/verify")
    public String verifyUser(@RequestParam String token) {

        Optional<User> optionalUser = userRepository.findAll()
                .stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst();

        if (optionalUser.isEmpty()) {
            return "❌ Token non valido o scaduto.";
        }

        User user = optionalUser.get();
        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "🎉 Email verificata con successo! Ora puoi accedere.";
    }

    // 🔑 Login solo se verificato
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Utente non trovato"));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Password errata"));
        }

        if (!user.isVerified()) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Account non verificato"));
        }

        // 🔥 Genera token JWT
        String token = jwtTools.createToken(user);

        // 🔐 Risposta JSON controllata
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("id", user.getId());
        responseBody.put("email", user.getEmail());
        responseBody.put("role", user.getRole());
        responseBody.put("name", user.getUsername());
        responseBody.put("token", token);

        return ResponseEntity.ok(responseBody);
    }
    // 🗑️ Elimina account
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Utente non trovato"));
        }

        userRepository.delete(user);

        return ResponseEntity.ok(Map.of("message", "Account eliminato con successo"));
    }



}

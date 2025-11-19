package pasquale.alberico.recipefinder.controllers;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.enums.Role;
import pasquale.alberico.recipefinder.repositories.UserRepository;
import pasquale.alberico.recipefinder.services.EmailService;
import pasquale.alberico.recipefinder.security.JWTTools;

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
    public Object login(@RequestBody User loginRequest)
    {
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) return "❌ Utente non trovato";
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            return "🚫 Password errata";
        if (!user.isVerified()) return "⚠️ Account non verificato";

        // 🔥 GENERA TOKEN JWT
        String token = jwtTools.createToken(user);

        user.setPassword(null); // mai mandare la password al frontend
        user.setToken(token);   // campo @Transient → non va nel DB

        return user;
    }

}

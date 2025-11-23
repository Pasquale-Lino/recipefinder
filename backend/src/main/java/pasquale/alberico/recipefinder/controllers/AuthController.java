package pasquale.alberico.recipefinder.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.enums.Role;
import pasquale.alberico.recipefinder.repositories.UserRepository;
import pasquale.alberico.recipefinder.security.JWTTools;
import pasquale.alberico.recipefinder.services.EmailService;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JWTTools jwtTools;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, EmailService emailService, JWTTools jwtTools) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtTools = jwtTools;
    }

    // REGISTRAZIONE
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return ResponseEntity.badRequest().body("⚠️ Utente già registrato con questa email");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setRole(Role.USER);
        newUser.setVerified(false);

        int code = 100000 + new Random().nextInt(900000);
        newUser.setVerificationCode(String.valueOf(code));

        userRepository.save(newUser);

        emailService.sendWelcomeEmail(newUser.getEmail(), newUser.getUsername());
        emailService.sendVerificationCode(newUser.getEmail(), newUser.getVerificationCode());

        return ResponseEntity.ok("✅ Registrazione completata! Ti abbiamo inviato un codice di verifica via email.");
    }

    // VERIFICA CODICE OTP
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");

        Map<String, Object> resp = new HashMap<>();

        if (email == null || code == null) {
            resp.put("error", "Email e codice sono obbligatori");
            return ResponseEntity.badRequest().body(resp);
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            resp.put("error", "Utente non trovato");
            return ResponseEntity.badRequest().body(resp);
        }

        if (user.isVerified()) {
            resp.put("error", "Account già verificato");
            return ResponseEntity.badRequest().body(resp);
        }

        if (!code.equals(user.getVerificationCode())) {
            resp.put("error", "Codice non valido");
            return ResponseEntity.badRequest().body(resp);
        }

        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        String token = jwtTools.generateToken(user);

        user.setPassword(null);

        resp.put("message", "Account verificato con successo!");
        resp.put("user", user);
        resp.put("token", token);

        return ResponseEntity.ok(resp);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Map<String, Object> resp = new HashMap<>();

        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            resp.put("error", "Utente non trovato");
            return ResponseEntity.badRequest().body(resp);
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            resp.put("error", "Password errata");
            return ResponseEntity.badRequest().body(resp);
        }

        if (!user.isVerified()) {
            resp.put("error", "Account non verificato");
            return ResponseEntity.badRequest().body(resp);
        }

        String token = jwtTools.generateToken(user);

        user.setPassword(null);

        resp.put("user", user);
        resp.put("token", token);

        return ResponseEntity.ok(resp);
    }


    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        User u = userRepository.findByEmail(email);
        if (u == null) return ResponseEntity.badRequest().body("Utente non trovato");

        userRepository.delete(u);
        return ResponseEntity.ok("Utente eliminato con successo");
    }
}

package pasquale.alberico.recipefinder.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.enums.Role;
import pasquale.alberico.recipefinder.repositories.UserRepository;
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
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // 🧑‍💻 REGISTRAZIONE: crea utente + genera CODICE OTP + invia email
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User newUser) {
        // se email già usata --> 400
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return ResponseEntity
                    .badRequest()
                    .body("⚠️ Utente già registrato con questa email");
        }

        // hash password
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setRole(Role.USER);
        newUser.setVerified(false);

        // 🔢 genera codice OTP a 6 cifre (es. 123456)
        int code = 100000 + new Random().nextInt(900000);
        String verificationCode = String.valueOf(code);
        newUser.setVerificationCode(verificationCode);

        // salva su DB
        userRepository.save(newUser);

        // email di benvenuto (opzionale)
        emailService.sendWelcomeEmail(newUser.getEmail(), newUser.getUsername());

        // email con CODICE
        emailService.sendVerificationCode(newUser.getEmail(), verificationCode);

        // risposta testuale (il frontend la legge con res.text())
        return ResponseEntity.ok(
                "✅ Registrazione completata! Ti abbiamo inviato un codice di verifica via email."
        );
    }

    // ✉️ VERIFICA CODICE: il frontend manda { email, code }
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");

        Map<String, String> resp = new HashMap<>();

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
            resp.put("message", "Account già verificato, puoi effettuare il login.");
            return ResponseEntity.ok(resp);
        }

        if (!code.equals(user.getVerificationCode())) {
            resp.put("error", "Codice di verifica non valido");
            return ResponseEntity.badRequest().body(resp);
        }

        // ✅ codice corretto → attivo l'account
        user.setVerified(true);
        user.setVerificationCode(null); // non serve più
        userRepository.save(user);

        resp.put("message", "🎉 Email verificata con successo! Ora puoi accedere.");
        return ResponseEntity.ok(resp);
    }

    // 🔑 LOGIN: consento solo se verified == true
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Map<String, String> resp = new HashMap<>();

        // cerco utente per email
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            resp.put("error", "Utente non trovato");
            return ResponseEntity.badRequest().body(resp);
        }

        // controllo password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            resp.put("error", "Password errata");
            return ResponseEntity.badRequest().body(resp);
        }

        // blocco se non verificato
        if (!user.isVerified()) {
            resp.put("error", "Account non verificato. Controlla la tua email per il codice.");
            return ResponseEntity.badRequest().body(resp);
        }

        // mai mandare password al frontend
        user.setPassword(null);

        // ritorno direttamente l'oggetto User (il tuo frontend fa login(data))
        return ResponseEntity.ok(user);
    }
    // 🧽 DELETE UTENTE (SOLO PER TEST)
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        User u = userRepository.findByEmail(email);
        if (u == null) return ResponseEntity.badRequest().body("Utente non trovato");

        userRepository.delete(u);
        return ResponseEntity.ok("Utente eliminato con successo");
    }

}

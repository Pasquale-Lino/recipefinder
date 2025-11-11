package pasquale.alberico.recipefinder.controllers;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.enums.Role;
import pasquale.alberico.recipefinder.repositories.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🧑‍💻 Registrazione nuovo utente
    @PostMapping("/register")
    public String register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return "⚠️ Utente già registrato con questa email";
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        if (newUser.getRole() == null) {
            newUser.setRole(Role.USER);
        }

        userRepository.save(newUser);
        return "✅ Registrazione completata per " + newUser.getEmail();
    }

    // 🔑 Login (verifica email + password)
    @PostMapping("/login")
    public Object login(@RequestBody User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            return "❌ Utente non trovato";
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return "🚫 Password errata";
        }

        // restituiamo i dati pubblici dell’utente (senza password)
        user.setPassword(null);
        return user;
    }

    // 👀 Recupera profilo (esempio futuro)
    @GetMapping("/me/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = Optional.ofNullable(userRepository.findByEmail(email));
        user.ifPresent(u -> u.setPassword(null));
        return user;
    }
}

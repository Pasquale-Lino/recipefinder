package pasquale.alberico.recipefinder.config;

import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.enums.Role;
import pasquale.alberico.recipefinder.repositories.UserRepository;

@Component
public class DataLoader {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        if (userRepository.findByEmail("admin@demo.it") == null) {
            User admin = new User("Admin", "admin@demo.it",
                    passwordEncoder.encode("admin123"), Role.ADMIN);
            userRepository.save(admin);
            System.out.println("👑 Admin creato: admin@demo.it / admin123");
        }

        if (userRepository.findByEmail("user@demo.it") == null) {
            User user = new User("Utente Demo", "user@demo.it",
                    passwordEncoder.encode("user123"), Role.USER);
            userRepository.save(user);
            System.out.println("👤 User creato: user@demo.it / user123");
        }
    }
}

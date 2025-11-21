// src/main/java/pasquale/alberico/recipefinder/entities/User.java
package pasquale.alberico.recipefinder.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import pasquale.alberico.recipefinder.enums.Role;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID numerico autoincrement
    private Long id;

    // 👤 username visibile nell'app
    private String username;

    // 📧 email dell'utente
    @Column(nullable = false, unique = true)
    private String email;

    // 🔐 password salvata HASHATA (BCrypt)
    @Column(nullable = false)
    private String password;

    // 👑 ruolo (USER / ADMIN)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // ✅ indica se l'utente ha verificato la mail
    @Column(nullable = false, name = "is_verified")
    private boolean verified = false;

    // 🔢 codice OTP per verifica email (es. "123456")
    @Column(name = "verification_code")
    private String verificationCode;

    // ❤️ relazione molti-a-molti con le ricette preferite
    @ManyToMany
    @JoinTable(
            name = "user_favorites",                        // nome tabella di join
            joinColumns = @JoinColumn(name = "user_id"),     // FK verso users
            inverseJoinColumns = @JoinColumn(name = "recipe_id") // FK verso recipes
    )
    private List<Recipe> favorites = new ArrayList<>();

    public User() {}

    public User(String username, String email, String password, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.verified = false;
    }
}

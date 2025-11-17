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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // ✅ Campi per verifica email
    @Column(nullable = false, name="is_verified")
    private boolean verified = false;
    @Column(name="verifcation_token")
    private String verificationToken;

    @ManyToMany
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "recipe_id")
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

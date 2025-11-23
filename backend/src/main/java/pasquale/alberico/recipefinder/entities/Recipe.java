package pasquale.alberico.recipefinder.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "recipes")
public class Recipe {

    @Id
    private Long id; // Spoonacular ID o ID custom (es. System.currentTimeMillis)

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(columnDefinition = "TEXT")
    private String ingredients;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String nutrition;

    private Integer readyInMinutes;

    private Integer servings;

    // visibilità ricetta
    @Column(name = "is_public", nullable = false)
    private boolean publicRecipe = false;

    // per carosello homepage
    @Column(nullable = false)
    private boolean featured = false;

    // ricetta può appartenere a un user (o essere null = Spoonacular)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}

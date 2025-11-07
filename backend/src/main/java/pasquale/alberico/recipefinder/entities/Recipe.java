package pasquale.alberico.recipefinder.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String instructions;
    @Column(columnDefinition = "TEXT")
    private String ingredients;
    private String image;
    private String nutrition;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

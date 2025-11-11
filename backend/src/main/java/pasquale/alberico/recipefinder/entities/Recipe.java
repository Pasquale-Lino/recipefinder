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

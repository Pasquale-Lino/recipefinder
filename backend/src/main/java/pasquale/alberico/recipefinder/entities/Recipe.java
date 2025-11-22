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
    @Column
    private Integer readyInMinutes;
    @Column
    private Integer servings;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}


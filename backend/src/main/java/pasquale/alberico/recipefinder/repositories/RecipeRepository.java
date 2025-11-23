package pasquale.alberico.recipefinder.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pasquale.alberico.recipefinder.entities.Recipe;
import pasquale.alberico.recipefinder.entities.User;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByTitleContainingIgnoreCase(String title);

    boolean existsByTitleIgnoreCase(String title);

    // Ricette SOLO pubbliche
    List<Recipe> findByPublicRecipeTrue();

    // Ricette dell’utente
    List<Recipe> findByUser(User user);

    // Featured per homepage
    List<Recipe> findByFeaturedTrue();
}

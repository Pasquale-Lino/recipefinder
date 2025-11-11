package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.entities.Recipe;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.repositories.UserRepository;
import pasquale.alberico.recipefinder.repositories.RecipeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public FavoriteController(UserRepository userRepository, RecipeRepository recipeRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    // ➕ Aggiunge una ricetta ai preferiti
    @PostMapping("/{userId}/{recipeId}")
    public String addFavorite(@PathVariable Long userId, @PathVariable Long recipeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Ricetta non trovata"));

        if (!user.getFavorites().contains(recipe)) {
            user.getFavorites().add(recipe);
            userRepository.save(user);
            return "✅ Ricetta aggiunta ai preferiti";
        }
        return "⚠️ Ricetta già presente nei preferiti";
    }

    // 🗑️ Rimuove una ricetta dai preferiti
    @DeleteMapping("/{userId}/{recipeId}")
    public String removeFavorite(@PathVariable Long userId, @PathVariable Long recipeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        user.getFavorites().removeIf(r -> r.getId().equals(recipeId));
        userRepository.save(user);
        return "🗑️ Ricetta rimossa dai preferiti";
    }

    // 📋 Restituisce tutti i preferiti dell’utente
    @GetMapping("/{userId}")
    public List<Recipe> getFavorites(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        return user.getFavorites();
    }
}

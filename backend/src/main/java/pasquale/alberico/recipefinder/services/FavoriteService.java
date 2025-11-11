package pasquale.alberico.recipefinder.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pasquale.alberico.recipefinder.entities.Recipe;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.repositories.RecipeRepository;
import pasquale.alberico.recipefinder.repositories.UserRepository;

import java.util.List;

@Service
public class FavoriteService {

    private static final Logger logger = LoggerFactory.getLogger(FavoriteService.class);

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public FavoriteService(UserRepository userRepository, RecipeRepository recipeRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    /**
     * ✅ Aggiunge una ricetta ai preferiti di un utente.
     */
    public String addFavorite(Long userId, Long recipeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ Utente non trovato: " + userId));
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("❌ Ricetta non trovata: " + recipeId));

        logger.info("🟡 Richiesta aggiunta preferito → user={}, recipe={}", userId, recipeId);

        if (user.getFavorites().contains(recipe)) {
            logger.info("⚠️ Ricetta già nei preferiti → recipeId={}", recipeId);
            return "⚠️ Ricetta già presente nei preferiti";
        }

        user.getFavorites().add(recipe);
        userRepository.save(user);

        logger.info("✅ Ricetta aggiunta ai preferiti → user={}, recipe={}", userId, recipeId);
        return "✅ Ricetta aggiunta ai preferiti";
    }

    /**
     * 🗑️ Rimuove una ricetta dai preferiti.
     */
    public String removeFavorite(Long userId, Long recipeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ Utente non trovato: " + userId));

        logger.info("🟠 Richiesta rimozione preferito → user={}, recipe={}", userId, recipeId);

        boolean removed = user.getFavorites().removeIf(r -> r.getId().equals(recipeId));

        if (removed) {
            userRepository.save(user);
            logger.info("🗑️ Ricetta rimossa dai preferiti → recipeId={}", recipeId);
            return "🗑️ Ricetta rimossa dai preferiti";
        } else {
            logger.info("⚠️ Ricetta non trovata tra i preferiti → recipeId={}", recipeId);
            return "⚠️ Ricetta non trovata tra i preferiti";
        }
    }

    /**
     * 📋 Restituisce tutti i preferiti dell’utente.
     */
    public List<Recipe> getFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ Utente non trovato: " + userId));

        logger.info("📦 Recupero preferiti dal DB → user={}, totale={}", userId, user.getFavorites().size());
        return user.getFavorites();
    }
}

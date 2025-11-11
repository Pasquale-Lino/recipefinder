package pasquale.alberico.recipefinder.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import pasquale.alberico.recipefinder.entities.Recipe;
import pasquale.alberico.recipefinder.repositories.RecipeRepository;

import java.util.*;

@Service
public class RecipeService {

    private static final Logger logger = LoggerFactory.getLogger(RecipeService.class);

    private final TranslationService translationService;
    private final RecipeRepository recipeRepository;

    public RecipeService(TranslationService translationService, RecipeRepository recipeRepository) {
        this.translationService = translationService;
        this.recipeRepository = recipeRepository;
    }

    @Value("${spoonacular.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";

    // 🔍 Ricerca per ingredienti — salva automaticamente nel DB se non ci sono
    public Map<String, Object> getRecipesByIngredients(String ingredients) {
        logger.info("🧂 Ricerca per ingredienti richiesta: {}", ingredients);

        String translatedIngredients = translationService.translateIngredients(ingredients);
        logger.info("🌍 Traduzione ingredienti: {} -> {}", ingredients, translatedIngredients);

        // Controlla se ci sono già ricette nel DB con questo titolo
        List<Recipe> existingRecipes = recipeRepository.findByTitleContainingIgnoreCase(translatedIngredients);
        if (!existingRecipes.isEmpty()) {
            logger.info("✅ Ricette trovate nel DB ({} risultati), nessuna chiamata a Spoonacular.", existingRecipes.size());
            return Map.of("results", existingRecipes);
        }

        logger.info("🔄 Nessuna ricetta nel DB, chiamata a Spoonacular in corso...");
        RestTemplate restTemplate = new RestTemplate();

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("ingredients", translatedIngredients)
                .queryParam("number", 20)
                .queryParam("ranking", 2)
                .queryParam("ignorePantry", true)
                .queryParam("apiKey", apiKey)
                .toUriString();

        Object[] apiResults = restTemplate.getForObject(url, Object[].class);
        List<Recipe> recipesToReturn = new ArrayList<>();

        if (apiResults != null) {
            logger.info("📦 Ricevuti {} risultati da Spoonacular.", apiResults.length);
            for (Object obj : apiResults) {
                Map<String, Object> map = (Map<String, Object>) obj;
                String title = (String) map.get("title");
                String image = (String) map.get("image");
                Long id = ((Number) map.get("id")).longValue();

                // Se esiste già nel DB, la usiamo; altrimenti la salviamo
                if (!recipeRepository.existsById(id)) {
                    Recipe recipe = new Recipe();
                    recipe.setId(id);
                    recipe.setTitle(title);
                    recipe.setImage(image);

                    recipeRepository.save(recipe);
                    logger.info("💾 Ricetta salvata nel DB: {} (ID {})", title, id);

                    recipesToReturn.add(recipe);
                } else {
                    Recipe existing = recipeRepository.findById(id).orElse(null);
                    if (existing != null) {
                        logger.info("📚 Ricetta già nel DB: {} (ID {})", existing.getTitle(), id);
                        recipesToReturn.add(existing);
                    }
                }
            }
        } else {
            logger.warn("⚠️ Nessuna risposta ricevuta da Spoonacular per: {}", ingredients);
        }

        return Map.of("results", recipesToReturn);
    }

    // 🔍 Dettaglio singola ricetta — se non è nel DB, la scarica e la salva
    public Map<String, Object> getRecipeDetails(long id) {
        logger.info("🔎 Richiesta dettaglio ricetta ID: {}", id);

        Optional<Recipe> existing = recipeRepository.findById(id);
        if (existing.isPresent()) {
            logger.info("✅ Ricetta ID {} trovata nel DB, restituita senza chiamata API.", id);
            return Map.of("recipe", existing.get());
        }

        logger.info("🌐 Ricetta ID {} non trovata, chiamata a Spoonacular...", id);
        RestTemplate restTemplate = new RestTemplate();

        String url = String.format(
                "https://api.spoonacular.com/recipes/%d/information?includeNutrition=true&apiKey=%s",
                id, apiKey
        );

        Map<String, Object> data = restTemplate.getForObject(url, Map.class);
        if (data == null) {
            logger.warn("⚠️ Nessun dato trovato per la ricetta ID {}", id);
            return Map.of("error", "Ricetta non trovata");
        }

        Recipe recipe = new Recipe();
        recipe.setId(((Number) data.get("id")).longValue());
        recipe.setTitle((String) data.get("title"));
        recipe.setImage((String) data.get("image"));
        recipe.setInstructions((String) data.get("instructions"));

        // Estrai ingredienti
        if (data.containsKey("extendedIngredients")) {
            List<Map<String, Object>> ings = (List<Map<String, Object>>) data.get("extendedIngredients");
            String joined = String.join(", ",
                    ings.stream().map(i -> (String) i.get("original")).toList());
            recipe.setIngredients(joined);
        }

        // Estrai nutrizione (JSON come stringa)
        if (data.containsKey("nutrition")) {
            recipe.setNutrition(data.get("nutrition").toString());
        }

        recipeRepository.save(recipe);
        logger.info("💾 Salvata nuova ricetta nel DB: {} (ID {})", recipe.getTitle(), recipe.getId());

        return Map.of("recipe", recipe);
    }

    // 📋 Ottieni tutte le ricette salvate nel DB
    public List<Recipe> getAllRecipes() {
        logger.info("📂 Richiesta elenco di tutte le ricette nel DB.");
        return recipeRepository.findAll();
    }
}

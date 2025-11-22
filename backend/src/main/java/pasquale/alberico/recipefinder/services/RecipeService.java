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

    private static final String SEARCH_URL =
            "https://api.spoonacular.com/recipes/findByIngredients";


    // ============================
    // 🔍 1) Search -> NON salva nulla
    // ============================
    public Map<String, Object> getRecipesByIngredients(String ingredients) {

        String translated = translationService.translateIngredients(ingredients);
        RestTemplate rest = new RestTemplate();

        String url = UriComponentsBuilder.fromHttpUrl(SEARCH_URL)
                .queryParam("ingredients", translated)
                .queryParam("number", 20)
                .queryParam("ranking", 2)
                .queryParam("ignorePantry", true)
                .queryParam("apiKey", apiKey)
                .toUriString();

        Object[] results = rest.getForObject(url, Object[].class);

        return Map.of("results", results);
    }


    // ================================================
    // 🔎 2) Detail -> salva SOLO se non esiste già
    // ================================================
    public Map<String, Object> getRecipeDetails(long id) {

        Optional<Recipe> existing = recipeRepository.findById(id);

        if (existing.isPresent()) {
            logger.info("📚 Ricetta ID {} caricata dal DB", id);
            return Map.of("recipe", existing.get());
        }

        logger.info("🌐 Ricetta ID {} non nel DB, scarico dettagli completi", id);

        Recipe r = fetchFullRecipe(id);
        recipeRepository.save(r);

        logger.info("💾 Salvata ricetta COMPLETA nel DB: {}", r.getTitle());

        return Map.of("recipe", r);
    }


    // ========================================
    // ⚙️ Scarica dettagli completi da Spoonacular
    // ========================================
    private Recipe fetchFullRecipe(long id) {

        RestTemplate rest = new RestTemplate();

        String url = String.format(
                "https://api.spoonacular.com/recipes/%d/information?includeNutrition=true&apiKey=%s",
                id, apiKey
        );

        Map<String, Object> data = rest.getForObject(url, Map.class);

        Recipe recipe = new Recipe();
        recipe.setId(id);
        recipe.setTitle((String) data.get("title"));
        recipe.setImage((String) data.get("image"));
        recipe.setInstructions((String) data.get("instructions"));
        recipe.setReadyInMinutes((Integer) data.get("readyInMinutes"));
        recipe.setServings((Integer) data.get("servings"));


        // Ingredienti
        if (data.containsKey("extendedIngredients")) {
            List<Map<String, Object>> ings =
                    (List<Map<String, Object>>) data.get("extendedIngredients");

            String joined = String.join(", ",
                    ings.stream().map(i -> (String) i.get("original")).toList()
            );

            recipe.setIngredients(joined);
        }

        // Nutrizione (JSON)
        if (data.containsKey("nutrition")) {
            recipe.setNutrition(data.get("nutrition").toString());
        }

        return recipe;
    }


    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }
}

package pasquale.alberico.recipefinder.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RecipeService {

    private final TranslationService translationService;

    public RecipeService(TranslationService translationService) {
        this.translationService = translationService;
    }

    @Value("${spoonacular.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";

    public Map<String, Object> getRecipesByIngredients(String ingredients) {
        RestTemplate restTemplate = new RestTemplate();

        // 🔁 Traduco gli ingredienti dall’italiano all’inglese (se necessario)
        String translatedIngredients = translationService.translateIngredients(ingredients);

        // 🧩 costruisco la query
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("ingredients", translatedIngredients)
                .queryParam("number", 20)
                .queryParam("ranking", 2) // TODO mostra prima le ricette con più ingredienti corrispondenti
                .queryParam("ignorePantry", true)
                .queryParam("apiKey", apiKey)
                .toUriString();

        System.out.println("🔍 Chiamata API Spoonacular: " + url);

        Object[] recipes = restTemplate.getForObject(url, Object[].class);
        return Map.of("results", recipes);
    }

    public Map<String, Object> getRecipeDetails(long id) {
        RestTemplate restTemplate = new RestTemplate();

        String url = String.format(
                "https://api.spoonacular.com/recipes/%d/information?includeNutrition=true&apiKey=%s",
                id, apiKey
        );

        return restTemplate.getForObject(url, Map.class);
    }
}

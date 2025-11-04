package pasquale.alberico.recipefinder.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.Map;

@Service
public class RecipeService {

    @Value("${spoonacular.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";

    public Map<String, Object> getRecipesByIngredients(String ingredients) {
        RestTemplate restTemplate = new RestTemplate();

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("ingredients", ingredients)
                .queryParam("number", 10)
                .queryParam("ranking", 1)
                .queryParam("ignorePantry", true)
                .queryParam("apiKey", apiKey)
                .toUriString();

        // Otteniamo direttamente un array, lo incapsuliamo in un Map per coerenza con il frontend
        Object[] recipes = restTemplate.getForObject(url, Object[].class);
        return Map.of("results", recipes);
    }
}

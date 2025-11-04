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

    private static final String BASE_URL = "https://api.spoonacular.com/recipes/complexSearch";

    public Map getRecipesByIngredients(String ingredients) {
        RestTemplate restTemplate = new RestTemplate();

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("includeIngredients", ingredients)
                .queryParam("addRecipeInformation", true)
                .queryParam("number", 10)
                .queryParam("apiKey", apiKey)
                .toUriString();

        return restTemplate.getForObject(url, Map.class);
    }
}

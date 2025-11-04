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
    private final RestTemplate restTemplate = new RestTemplate();

    public RecipeService(TranslationService translationService) {
        this.translationService = translationService;
    }

    @Value("${spoonacular.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";

    // 🧠 Cache locale per le ricerche e per i dettagli
    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();

    // ⏱ Durata della cache (in millisecondi)
    // Esempio: 12 ore = 12 * 60 * 60 * 1000
    private static final long CACHE_TTL_MS = 12 * 60 * 60 * 1000;

    /**
     * 🔍 Ricerca ricette per ingredienti (con cache)
     */
    public Map<String, Object> getRecipesByIngredients(String ingredients) {
        String cacheKey = "search:" + ingredients.toLowerCase().trim();

        // ✅ Controlla se è in cache e ancora valida
        CachedResponse cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            System.out.println("📦 [CACHE HIT] Ricette per: " + cacheKey);
            return cached.data();
        }

        // 🔁 Traduzione ingredienti
        String translatedIngredients = translationService.translateIngredients(ingredients);
        System.out.println("🌐 [API CALL] Traduzione ingredienti: " + ingredients + " → " + translatedIngredients);

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("ingredients", translatedIngredients)
                .queryParam("number", 10)
                .queryParam("ranking", 2)
                .queryParam("ignorePantry", true)
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            Object[] recipes = restTemplate.getForObject(url, Object[].class);
            Map<String, Object> result = Map.of("results", recipes);

            // 🗃️ Salva in cache
            cache.put(cacheKey, new CachedResponse(result, Instant.now()));

            return result;
        } catch (Exception e) {
            System.err.println("❌ Errore durante la chiamata Spoonacular: " + e.getMessage());
            return Map.of("error", "Errore nella chiamata API: " + e.getMessage());
        }
    }

    /**
     * 🔎 Dettagli di una singola ricetta (con cache)
     */
    public Map<String, Object> getRecipeDetails(long id) {
        String cacheKey = "details:" + id;

        // ✅ Controlla la cache
        CachedResponse cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            System.out.println("📦 [CACHE HIT] Dettagli ricetta ID: " + id);
            return cached.data();
        }

        String url = String.format(
                "https://api.spoonacular.com/recipes/%d/information?includeNutrition=true&apiKey=%s",
                id, apiKey
        );

        try {
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);

            // 🗃️ Salva in cache
            cache.put(cacheKey, new CachedResponse(result, Instant.now()));

            return result;
        } catch (Exception e) {
            System.err.println("❌ Errore dettagli ricetta: " + e.getMessage());
            return Map.of("error", "Errore nella chiamata dettagli API: " + e.getMessage());
        }
    }

    /**
     * 📦 Classe interna per rappresentare una risposta cacheata
     */
    private record CachedResponse(Map<String, Object> data, Instant timestamp) {
        boolean isExpired() {
            return Instant.now().toEpochMilli() - timestamp.toEpochMilli() > CACHE_TTL_MS;
        }
    }
}

package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.services.RecipeService;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/search")
    public Map<String, Object> searchRecipes(@RequestParam String ingredients) {
        return recipeService.getRecipesByIngredients(ingredients);
    }

    @GetMapping
    public List<Map<String, Object>> getAllRecipes() {
        return List.of(
                Map.of("nome", "Pasta al pomodoro", "descrizione", "Ricetta semplice e veloce"),
                Map.of("nome", "Tiramisù", "descrizione", "Dolce classico italiano")
        );
    }
}

package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.services.RecipeService;

import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173") // Consente richieste dal frontend React
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    /**
     * Endpoint per cercare ricette in base agli ingredienti.
     * Esempio: GET /api/recipes/search?ingredients=egg,flour,milk
     */
    @GetMapping("/search")
    public Map searchRecipes(@RequestParam String ingredients) {
        return recipeService.getRecipesByIngredients(ingredients);
    }
}

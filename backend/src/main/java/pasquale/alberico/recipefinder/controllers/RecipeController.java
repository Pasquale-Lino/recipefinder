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
    @GetMapping("/{id}")
    public Map<String, Object> getRecipeDetails(@PathVariable long id) {
        return recipeService.getRecipeDetails(id);
    }


}

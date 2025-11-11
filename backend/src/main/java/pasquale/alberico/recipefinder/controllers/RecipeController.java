package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.entities.Recipe;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.repositories.UserRepository;
import pasquale.alberico.recipefinder.repositories.RecipeRepository;
import pasquale.alberico.recipefinder.services.RecipeService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeService recipeService;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public RecipeController(RecipeService recipeService,
                            UserRepository userRepository,
                            RecipeRepository recipeRepository) {
        this.recipeService = recipeService;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    @GetMapping("/search")
    public Map<String, Object> searchRecipes(@RequestParam String ingredients) {
        return recipeService.getRecipesByIngredients(ingredients);
    }

    @GetMapping("/{id}")
    public Map<String, Object> getRecipeDetails(@PathVariable long id) {
        return recipeService.getRecipeDetails(id);
    }

    @GetMapping("/all")
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

}

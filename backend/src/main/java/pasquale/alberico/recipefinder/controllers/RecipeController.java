package pasquale.alberico.recipefinder.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pasquale.alberico.recipefinder.entities.Recipe;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.enums.Role;
import pasquale.alberico.recipefinder.exceptions.UnauthorizedException;
import pasquale.alberico.recipefinder.repositories.RecipeRepository;
import pasquale.alberico.recipefinder.services.RecipeService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final RecipeService recipeService;

    public RecipeController(RecipeRepository recipeRepository, RecipeService recipeService) {
        this.recipeRepository = recipeRepository;
        this.recipeService = recipeService;
    }

    // 🔍 Ricerca Spoonacular
    @GetMapping("/search")
    public Map<String, Object> searchRecipes(@RequestParam String ingredients) {
        return recipeService.getRecipesByIngredients(ingredients);
    }

    // 📄 Dettaglio (Spoonacular o DB)
    @GetMapping("/{id}")
    public Map<String, Object> getRecipeDetails(@PathVariable long id) {
        return recipeService.getRecipeDetails(id);
    }

    // Tutte dal DB
    @GetMapping("/all")
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    // Solo pubbliche
    @GetMapping("/public")
    public List<Recipe> getPublicRecipes() {
        return recipeService.getPublicRecipes();
    }

    // Ricette dell’utente loggato
    @GetMapping("/me")
    public List<Recipe> getMyRecipes(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return recipeService.getRecipesByUser(currentUser);
    }

    // Featured per homepage
    @GetMapping("/featured")
    public List<Recipe> getFeaturedRecipes() {
        return recipeRepository.findByFeaturedTrue();
    }

    // ============================
    //        ADMIN ONLY
    // ============================

    // ➕ Crea ricetta
    @PostMapping("/create")
    public Recipe createRecipe(
            @RequestParam String title,
            @RequestParam String ingredients,
            @RequestParam String instructions,
            @RequestParam Integer readyInMinutes,
            @RequestParam(required = false) MultipartFile image,
            Authentication auth
    ) throws IOException {

        User user = (User) auth.getPrincipal();
        if (user.getRole() != Role.ADMIN)
            throw new UnauthorizedException("Solo admin può creare ricette");

        return recipeService.createRecipe(title, ingredients, instructions, readyInMinutes, image, user);
    }

    // ✏️ UPDATE ricetta
    @PutMapping("/admin/{id}")
    public Recipe updateRecipe(
            @PathVariable long id,
            @RequestParam String title,
            @RequestParam String ingredients,
            @RequestParam String instructions,
            @RequestParam Integer readyInMinutes,
            @RequestParam(required = false) MultipartFile image,
            Authentication auth
    ) throws IOException {

        User user = (User) auth.getPrincipal();
        if (user.getRole() != Role.ADMIN)
            throw new UnauthorizedException("Solo admin può modificare ricette");

        return recipeService.updateRecipe(id, title, ingredients, instructions, readyInMinutes, image);
    }

    // ⭐ Toggle featured
    @PutMapping("/admin/{id}/featured")
    public Recipe toggleFeatured(@PathVariable long id, Authentication auth) {

        User u = (User) auth.getPrincipal();
        if (u.getRole() != Role.ADMIN)
            throw new UnauthorizedException("Solo admin");

        Recipe r = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ricetta non trovata"));

        r.setFeatured(!r.isFeatured());
        return recipeRepository.save(r);
    }

    // 🌍 Toggle public/private
    @PutMapping("/admin/{id}/public")
    public Recipe togglePublic(@PathVariable long id, Authentication auth) {

        User u = (User) auth.getPrincipal();
        if (u.getRole() != Role.ADMIN)
            throw new UnauthorizedException("Solo admin");

        Recipe r = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ricetta non trovata"));

        r.setPublicRecipe(!r.isPublicRecipe());
        return recipeRepository.save(r);
    }

    // 🗑 Delete
    @DeleteMapping("/admin/{id}")
    public void deleteRecipe(@PathVariable long id, Authentication auth) {
        User u = (User) auth.getPrincipal();
        if (u.getRole() != Role.ADMIN)
            throw new UnauthorizedException("Solo admin");

        recipeRepository.deleteById(id);
    }
}

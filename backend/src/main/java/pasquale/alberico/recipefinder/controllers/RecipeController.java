package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RecipeController {

    @GetMapping("/test")
    public String testConnection() {
        return "Backend raggiunto con successo!";
    }

    // Endpoint per ricevere una nuova ricetta
    @PostMapping("/recipes")
    public Map<String, Object> createRecipe(@RequestBody Map<String, Object> recipe) {
        // In un'app reale qui salveresti la ricetta nel database
        return Map.of(
                "status", "ok",
                "message", "Ricetta ricevuta correttamente!",
                "ricetta", recipe
        );
    }
}

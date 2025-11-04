package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // consente richieste dal frontend React
public class RecipeController {
    @GetMapping("/recipes")
    public List<Map<String, Object>> getRecipes() {
        return List.of(
                Map.of("nome", "Spaghetti alla Carbonara", "descrizione", "Classico piatto romano"),
                Map.of("nome", "Tiramisù", "descrizione", "Dolce al mascarpone e caffè"),
                Map.of("nome", "Pizza Margherita", "descrizione", "Pomodoro, mozzarella e basilico")
        );
    }

    @GetMapping("/test")
    public String testConnection() {
        return "✅ Backend raggiunto con successo!";
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

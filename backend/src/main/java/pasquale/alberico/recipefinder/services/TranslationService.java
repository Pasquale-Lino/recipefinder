package pasquale.alberico.recipefinder.services;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    // Mappa statica ITA → ENG per ingredienti comuni
    private static final Map<String, String> ingredientMap = new HashMap<>();

    static {
        ingredientMap.put("uova", "eggs");
        ingredientMap.put("manzo", "beef");
        ingredientMap.put("panna", "cream");
        ingredientMap.put("cioccolato", "chocolate");
        ingredientMap.put("farina", "flour");
        ingredientMap.put("latte", "milk");
        ingredientMap.put("burro", "butter");
        ingredientMap.put("zucchero", "sugar");
        ingredientMap.put("olio", "oil");
        ingredientMap.put("vitello", "veal");
        ingredientMap.put("pomodoro", "tomato");
        ingredientMap.put("formaggio", "cheese");
        ingredientMap.put("sale", "salt");
        ingredientMap.put("pepe", "pepper");
        ingredientMap.put("pollo", "chicken");
        ingredientMap.put("carne", "meat");
        ingredientMap.put("pesce", "fish");
        ingredientMap.put("mozzarella", "mozzarella cheese");

        ingredientMap.put("mele", "apples");
        ingredientMap.put("banane", "bananas");
        ingredientMap.put("spinaci", "spinach");
        ingredientMap.put("carote", "carrots");
        ingredientMap.put("patate", "potatoes");
        ingredientMap.put("cipolle", "onions");
        ingredientMap.put("aglio", "garlic");
        ingredientMap.put("peperoni", "bell peppers");
        ingredientMap.put("maiale", "pork");
        ingredientMap.put("agnello", "lamb");
        ingredientMap.put("salsiccia", "sausage");
        ingredientMap.put("tonno", "tuna");
        ingredientMap.put("salmone", "salmon");
        ingredientMap.put("yogurt", "yogurt");
        ingredientMap.put("ricotta", "ricotta cheese");
        ingredientMap.put("riso", "rice");
        ingredientMap.put("pasta", "pasta");
        ingredientMap.put("fagioli", "beans");
        ingredientMap.put("lenticchie", "lentils");
        ingredientMap.put("noci", "nuts");
        ingredientMap.put("paprika", "paprika");
        ingredientMap.put("curry", "curry powder");
        ingredientMap.put("zenzero", "ginger");
        ingredientMap.put("cumin", "cumin");
        ingredientMap.put("coriandolo", "coriander");
        ingredientMap.put("vaniglia", "vanilla");
        ingredientMap.put("limone", "lemon");
        ingredientMap.put("lime", "lime");
        ingredientMap.put("menta", "mint");
        ingredientMap.put("timo", "thyme");
        ingredientMap.put("rosmarino", "rosemary");
        ingredientMap.put("alloro", "bay leaves");
        ingredientMap.put("origano", "oregano");
        ingredientMap.put("basilico", "basil");
    }

    public String translateIngredients(String italianList) {
        String[] ingredients = italianList.split(",");
        StringBuilder translated = new StringBuilder();

        for (String i : ingredients) {
            String cleaned = i.trim().toLowerCase();
            String english = ingredientMap.getOrDefault(cleaned, cleaned);
            translated.append(english).append(",");
        }

        // Rimuove ultima virgola
        if (translated.length() > 0)
            translated.setLength(translated.length() - 1);

        return translated.toString();
    }
}

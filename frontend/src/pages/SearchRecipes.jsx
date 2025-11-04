import { useState } from "react";
import { apiFetch } from "../api/api";
/**
 * Componente per cercare ricette in base agli ingredienti inseriti dall'utente.
 * - Usa useState per gestire ingredienti, ricette e stato di caricamento.
 * - Chiama il backend (che a sua volta interroga l’API Spoonacular).
 * - Mostra un elenco di ricette con immagine, titolo, tempo e porzioni.
 */
function SearchRecipes() {
  const [ingredients, setIngredients] = useState("");  // Ingredienti inseriti dall’utente
  const [recipes, setRecipes] = useState([]);          // Lista delle ricette trovate
  const [loading, setLoading] = useState(false);       // Stato di caricamento
  const [error, setError] = useState("");

  /**
   * Funzione che esegue la ricerca delle ricette.
   * - Effettua una chiamata GET al backend con gli ingredienti come query string.
   * - Aggiorna lo stato delle ricette con i risultati ricevuti.
   * - Gestisce eventuali errori e mostra un messaggio di caricamento.
   */
  const search = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`/recipes/search?ingredients=${ingredients}`);
      console.log("📦 Risposta API:", data);
      setRecipes(data.results || []);
    } catch (err) {
      console.error("Errore ricerca:", err);
      setError("Errore nel recupero delle ricette 😞");
    } finally {
      setLoading(false);
    }
  };
// Renderizza il campo di input, il pulsante di ricerca e la lista delle ricette trovate 
// Ogni ricetta mostra titolo, immagine, tempo di preparazione e porzioni 
// L'input aggiorna lo stato degli ingredienti al cambiamento
// La lista delle ricette viene mappata dallo stato delle ricette
// Ogni elemento della lista ha una chiave unica basata sull'id della ricetta 
// La funzione di ricerca è asincrona per gestire le chiamate API 
// Lo stato delle ricette viene inizializzato come array vuoto
// Lo stato degli ingredienti viene inizializzato come stringa vuota

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔍 Cerca ricette per ingredienti</h1>
      <input
        type="text"
        placeholder="es. uova, latte, farina"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <button onClick={search}>Cerca</button>

      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {recipes.map((r) => (
          <li key={r.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <strong>{r.title}</strong><br />
            <img src={r.image} alt={r.title} width="200" style={{ borderRadius: "10px" }} /><br />
            <p>
              🧂 Ingredienti usati: {r.usedIngredientCount} | ❌ Ingredienti mancanti: {r.missedIngredientCount}
            </p>
            <p>❤️ Likes: {r.likes}</p>
          </li>
        ))}
      </ul>

      {recipes.length === 0 && !loading && !error && <p>Nessuna ricetta trovata 😢</p>}
    </div>
  );
}

export default SearchRecipes;

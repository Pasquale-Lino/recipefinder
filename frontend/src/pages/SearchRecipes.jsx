import { useState } from "react";
import { apiFetch } from "../api/api";
// Componente per cercare ricette in base agli ingredienti inseriti dall'utente 
function SearchRecipes() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
// Funzione per eseguire la ricerca delle ricette 
// Chiama l'API con gli ingredienti come query string 
// Aggiorna lo stato delle ricette con i risultati ricevuti 
  const search = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/recipes/search?ingredients=${ingredients}`);
      setRecipes(data.results || []);
    } catch (err) {
      console.error("Errore ricerca:", err);
    } finally {
      setLoading(false);
    }
  };
// Renderizza il campo di input, il pulsante di ricerca e la lista delle ricette trovate 
// Ogni ricetta mostra titolo, immagine, tempo di preparazione e porzioni 
// L'input aggiorna lo stato degli ingredienti al cambiamento
// La lista delle ricette viene mappata dallo stato delle ricette
// Ogni elemento della lista ha una chiave unica basata sull'id della ricetta 
// Viene mostrato il tempo di preparazione e il numero di porzioni per ogni ricetta 
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

      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong><br />
            <img src={r.image} alt={r.title} width="150" /><br />
            {r.readyInMinutes} min | {r.servings} porzioni
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchRecipes;

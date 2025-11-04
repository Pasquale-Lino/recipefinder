// src/pages/SearchRecipes.jsx
import { useState } from "react";
import { apiFetch } from "../api/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Componente per cercare ricette in base agli ingredienti inseriti dall'utente.
 * - Usa useState per gestire ingredienti, ricette e stato di caricamento.
 * - Chiama il backend (che a sua volta interroga l’API Spoonacular).
 * - Mostra un elenco di ricette con immagine, titolo, tempo e porzioni.
 * - Utilizza Bootstrap per una migliore resa grafica e layout responsive.
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
  // Ogni ricetta viene mostrata come card Bootstrap responsive con immagine e dettagli
  // L'input aggiorna lo stato degli ingredienti al cambiamento
  // La funzione di ricerca è asincrona per gestire le chiamate API
  // Lo stato delle ricette viene inizializzato come array vuoto
  // Lo stato degli ingredienti viene inizializzato come stringa vuota

  return (
    <div className="container mt-5">
      {/* Titolo e campo di ricerca */}
      <h1 className="text-center mb-4">🔍 Cerca ricette per ingredienti</h1>

      <div className="input-group mb-4 shadow-sm">
        <input
          type="text"
          className="form-control"
          placeholder="es. uova, latte, farina"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button className="btn btn-primary" onClick={search}>
          Cerca
        </button>
      </div>

      {/* Messaggi di caricamento o errore */}
      {loading && <p className="text-center text-muted">Caricamento...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Lista delle ricette */}
      <div className="row">
        {recipes.map((r) => (
          <div key={r.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src={r.image}
                className="card-img-top"
                alt={r.title}
                style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
              />
              <div className="card-body">
                <h5 className="card-title">{r.title}</h5>
                <p className="card-text text-muted">
                  🧂 Ingredienti usati: {r.usedIngredientCount}<br />
                  ❌ Ingredienti mancanti: {r.missedIngredientCount}<br />
                  ❤️ Likes: {r.likes}
                </p>
                <Link
                  to={`/recipe/${r.id}`}
                  className="btn btn-outline-success w-100"
                >
                  Vedi dettagli
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messaggio se non ci sono risultati */}
      {recipes.length === 0 && !loading && !error && (
        <p className="text-center text-muted mt-4">Nessuna ricetta trovata 😢</p>
      )}
    </div>
  );
}

export default SearchRecipes;

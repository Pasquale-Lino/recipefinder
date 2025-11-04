// src/pages/RecipesPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api"; // usa la funzione che ho già creato
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
/**
 * Pagina che mostra l'elenco delle ricette disponibili.
 * - Recupera le ricette dal backend al montaggio del componente.
 * - Gestisce gli stati di caricamento e errore.
 * - Mostra la lista o messaggi alternativi.
 */
function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
// Carica le ricette dal backend quando il componente viene montato
// Uso useEffect per eseguire il fetch una sola volta
// all'inizio del ciclo di vita del componente 
// (comportamento simile a componentDidMount) 
// Imposta lo stato delle ricette con i dati ricevuti
// Gestisce lo stato di caricamento e gli errori 
useEffect(() => {
    apiFetch("/recipes")
    .then((data) => {
        setRecipes(Array.isArray(data) ? data : []); // evita errori se la risposta non è un array
        setLoading(false);
    })
    .catch((err) => {
        console.error("Errore nel caricamento:", err);
        setError("Errore nel caricamento delle ricette");
        setLoading(false);
    });
}, []);

// Mostra un messaggio di caricamento, errore o la lista delle ricette in base allo stato
  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">📋 Ricette disponibili</h1>
        {recipes.length === 0 ? (
          <p className="text-center text-muted">Nessuna ricetta trovata 😢</p>
        ) : (
          <div className="row">
            {recipes.map((r, i) => (
              <div key={i} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body">
                    <h5 className="card-title">{r.nome || "Ricetta senza nome"}</h5>
                    <p className="card-text">
                      {r.descrizione || "Nessuna descrizione disponibile"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default RecipesPage;

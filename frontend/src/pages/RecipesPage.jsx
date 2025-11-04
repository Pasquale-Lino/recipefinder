// src/pages/RecipesPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api"; // usa la funzione che ho già creato

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
    <div style={{ padding: "20px" }}>
      <h1>Ricette disponibili</h1>
      <Link to="/">⬅ Torna alla Home</Link>

      {recipes.length === 0 ? (
        <p>Nessuna ricetta trovata.</p>
      ) : (
        <ul>
          {recipes.map((r, i) => (
            <li key={i}>
              <strong>{r.nome || "Ricetta senza nome"}</strong> — {r.descrizione || "Nessuna descrizione"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecipesPage;

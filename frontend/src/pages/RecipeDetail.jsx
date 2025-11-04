import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
// Carica i dettagli della ricetta dal backend quando il componente viene montato
// Uso useEffect per eseguire il fetch quando l'id cambia
// Imposta lo stato della ricetta con i dati ricevuti
// Gestisce lo stato di caricamento e gli errori 
// L'id della ricetta viene ottenuto dai parametri dell'URL
// La funzione di fetch è asincrona per gestire la chiamata API

  useEffect(() => {
    apiFetch(`/recipes/${id}`)
      .then((data) => {
        console.log("🍽️ Dettagli ricetta:", data);
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore:", err);
        setError("Errore nel caricamento dei dettagli 😞");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!recipe) return <p>Nessuna ricetta trovata.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/search">⬅ Torna alla ricerca</Link>
      <h1>{recipe.title}</h1>
      <img
        src={recipe.image}
        alt={recipe.title}
        width="400"
        style={{ borderRadius: "10px" }}
      />

      <h3>🍳 Istruzioni</h3>
      <p>{recipe.instructions || "Nessuna istruzione disponibile."}</p>

      <h3>🥣 Ingredienti</h3>
      <ul>
        {recipe.extendedIngredients?.map((ing) => (
          <li key={ing.id}>
            {ing.original}
          </li>
        ))}
      </ul>

      {recipe.nutrition && (
        <>
          <h3>⚖️ Valori nutrizionali</h3>
          <ul>
            {recipe.nutrition.nutrients.slice(0, 5).map((n, i) => (
              <li key={i}>
                {n.name}: {n.amount} {n.unit}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default RecipeDetail;

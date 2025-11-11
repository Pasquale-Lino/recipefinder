// src/pages/RecipeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import { translateText } from "../utils/translate";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const needsTranslation = (text) => {
    if (!text) return false;
    const englishHints = ["the", "and", "with", "in", "of", "mix", "bake", "add", "minutes"];
    return englishHints.some((word) => text.toLowerCase().includes(word));
  };

  // 🔹 Carica dettagli ricetta + stato preferito
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await apiFetch(`/recipes/${id}`);

        // 🔁 Traduzione automatica
        const translatedTitle = needsTranslation(data.title)
          ? await translateText(data.title)
          : data.title;

        const translatedInstructions = needsTranslation(data.instructions)
          ? await translateText(data.instructions)
          : data.instructions;

        const translatedIngredients = await Promise.all(
          (data.extendedIngredients || []).map(async (ing) => ({
            ...ing,
            original: needsTranslation(ing.original)
              ? await translateText(ing.original)
              : ing.original,
          }))
        );

        setRecipe({
          ...data,
          title: translatedTitle,
          instructions: translatedInstructions,
          extendedIngredients: translatedIngredients,
        });

        // 🔹 Se loggato, controlla se è tra i preferiti
        if (user) {
          const favorites = await fetch(`http://localhost:8080/api/favorites/${user.id}`);
          const favList = await favorites.json();
          const found = favList.some((fav) => fav.id === Number(id));
          setIsFavorite(found);
          console.log("💾 Preferiti caricati:", favList);
        }
      } catch (err) {
        console.error("Errore nel caricamento:", err);
        setError("Errore nel caricamento della ricetta 😞");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  // ❤️ Aggiunge o rimuove dai preferiti
  const toggleFavorite = async () => {
    if (!user) {
      alert("Effettua il login per salvare nei preferiti 🔐");
      return;
    }

    const method = isFavorite ? "DELETE" : "POST";
    const url = `http://localhost:8080/api/favorites/${user.id}/${id}`;

    try {
      const res = await fetch(url, { method });
      const msg = await res.text();
      console.log(msg);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Errore nel salvataggio preferito:", err);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="text-center text-light mt-5">Caricamento...</div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="text-center text-danger mt-5">{error}</div>
      </>
    );

  if (!recipe)
    return (
      <>
        <Navbar />
        <div className="text-center text-muted mt-5">
          Nessuna ricetta trovata 😢
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container my-5 d-flex justify-content-center">
        <div className="card shadow" style={{ maxWidth: "800px" }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-3">{recipe.title}</h2>

            <img
              src={recipe.image}
              alt={recipe.title}
              className="img-fluid rounded mx-auto d-block mb-4"
              style={{ maxWidth: "400px" }}
            />

            <div className="text-center mb-3">
              <span className="badge bg-success me-2">
                ⏱️ {recipe.readyInMinutes} min
              </span>
              <span className="badge bg-secondary">
                🍽️ {recipe.servings} porzioni
              </span>
            </div>

            {/* ❤️ Bottone Preferiti */}
            {user && (
              <div className="text-center mb-3">
                <button
                  onClick={toggleFavorite}
                  className={`btn ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
                >
                  {isFavorite ? "💔 Rimuovi dai preferiti" : "❤️ Aggiungi ai preferiti"}
                </button>
              </div>
            )}

            <h5 className="mt-4">🧂 Ingredienti</h5>
            <ul className="list-group mb-4">
              {recipe.extendedIngredients?.map((ing, i) => (
                <li className="list-group-item" key={i}>
                  {ing.original}
                </li>
              ))}
            </ul>

            <h5>👨‍🍳 Istruzioni</h5>
            <div
              className="alert alert-light"
              dangerouslySetInnerHTML={{
                __html: recipe.instructions || "Nessuna istruzione disponibile",
              }}
            ></div>

            <div className="text-center mt-4">
              <Link to="/home" className="btn btn-success">
                🔙 Torna alla ricerca
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeDetail;

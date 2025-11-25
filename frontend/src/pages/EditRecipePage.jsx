import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../hooks/useAuth";

function EditRecipePage() {
    useEffect(() => {
  document.title = "Modifica ricetta - Recipe Finder";
}, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [readyInMinutes, setReadyInMinutes] = useState("");
  const [image, setImage] = useState(null);

  // ==========================
  //    CARICA RICETTA ESISTENTE
  // ==========================
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const res = await apiFetch(`/recipes/${id}`);
        const r = res.recipe;

        setRecipe(r);
        setTitle(r.title);
        setIngredients(r.ingredients);
        setInstructions(r.instructions);
        setReadyInMinutes(r.readyInMinutes);
      } catch (err) {
        console.error("Errore caricamento ricetta:", err);
      }
    };

    loadRecipe();
  }, [id]);

  // ==========================
  //   CONTROLLO PERMESSI
  // ==========================
  if (!user || user.role !== "ADMIN") {
    return <h2 className="text-center py-5">Accesso negato</h2>;
  }

  if (!recipe) return <p className="text-center mt-5">Caricamento...</p>;

  // ==========================
  //   SALVA MODIFICHE
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    formData.append("readyInMinutes", readyInMinutes);
    if (image) formData.append("image", image);

    try {
      await fetch(`http://localhost:8080/api/recipes/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      alert("Ricetta aggiornata con successo!");
      navigate("/profile");

    } catch (err) {
      console.error("Errore salvataggio:", err);
      alert("Errore durante l'aggiornamento!");
    }
  };

  return (
    <div className="container py-5">
      <h2>✏️ Modifica ricetta</h2>

      <form onSubmit={handleSubmit} className="mt-4">

        <label className="form-label">Titolo</label>
        <input
          type="text"
          className="form-control mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="form-label">Ingredienti</label>
        <textarea
          className="form-control mb-3"
          rows="5"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />

        <label className="form-label">Istruzioni</label>
        <textarea
          className="form-control mb-3"
          rows="6"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />

        <label className="form-label">Tempo di preparazione (minuti)</label>
        <input
          type="number"
          className="form-control mb-3"
          value={readyInMinutes}
          onChange={(e) => setReadyInMinutes(e.target.value)}
          required
        />

        <label className="form-label">Nuova immagine (opzionale)</label>
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="btn btn-warning mt-3">
          💾 Salva modifiche
        </button>
      </form>
    </div>
  );
}

export default EditRecipePage;

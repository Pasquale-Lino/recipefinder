import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/recipes/${id}`)
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento:", err);
        setError("Errore nel caricamento della ricetta 😞");
        setLoading(false);
      });
  }, [id]);

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
      <div className="container my-5">
        <div className="card shadow">
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
              dangerouslySetInnerHTML={{ __html: recipe.instructions || "Nessuna istruzione disponibile" }}
            ></div>

            <h5>📊 Info nutrizionali</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Elemento</th>
                  <th>Quantità</th>
                </tr>
              </thead>
              <tbody>
                {recipe.nutrition?.nutrients?.slice(0, 6).map((n, i) => (
                  <tr key={i}>
                    <td>{n.name}</td>
                    <td>{n.amount} {n.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-center mt-4">
              <Link to="/search" className="btn btn-success">
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

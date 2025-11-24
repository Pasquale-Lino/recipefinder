import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";

function ProfilePage() {
  const { user, logout } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // =============================
  //   CARICA DATI PROFILO
  // =============================
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // ricette create dall'utente loggato
        const recipes = await apiFetch("/recipes/me");
        setMyRecipes(recipes);

        // preferiti
        if (user.id) {
          const fav = await apiFetch(`/favorites/${user.id}`);
          setFavorites(fav);
        }
      } catch (error) {
        console.error("Errore caricamento profilo:", error);
      }
    };

    loadData();
  }, [user]);

  // =============================
  //   ELIMINA RICETTA
  // =============================
  const deleteRecipe = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questa ricetta?")) return;

    try {
      await apiFetch(`/recipes/admin/${id}`, { method: "DELETE" });
      setMyRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Errore eliminazione ricetta:", err);
      alert("Errore nell'eliminazione.");
    }
  };

  // =============================
  //   SE NON LOGGATO
  // =============================
  if (!user) {
    return (
      <div className="text-center py-5">
        <h2>Effettua il login per accedere al tuo profilo 🔐</h2>
        <button
          className="btn btn-warning mt-3"
          data-bs-toggle="modal"
          data-bs-target="#loginModal"
        >
          🔑 Login
        </button>
      </div>
    );
  }

  return (
    <div className="customProfile">
      <div className="container py-5">
        {/* HEADER PROFILO */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>👋 Benvenuto, {user.username || user.email}</h2>
          <button className="btn btn-outline-success" onClick={logout}>
            🚪 Esci
          </button>
        </div>

        {/* ======================= */}
        {/*    LE MIE RICETTE      */}
        {/* ======================= */}
        <div className="mb-5">
          <h4>📒 Le mie ricette</h4>

          <div className="row g-4 mt-3">
            {myRecipes.length === 0 ? (
              <p className="text-muted">Nessuna ricetta creata finora.</p>
            ) : (
              myRecipes.map((r) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-3 d-flex"
                  key={r.id}
                >
                  <div className="card shadow-sm w-100 h-100">
                    <img
                      src={
                        r.image ||
                        "https://via.placeholder.com/600x400?text=Nessuna+immagine"
                      }
                      className="card-img-top"
                      alt={r.title}
                      style={{ height: "220px", objectFit: "cover" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{r.title}</h5>

                      <div className="mt-3 d-flex justify-content-between">
                        <Link
                          to={`/recipe/${r.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          👁️ Vedi
                        </Link>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteRecipe(r.id)}
                        >
                          🗑️ Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link to="/create-recipe" className="btn btn-success mt-3">
            ➕ Crea una nuova ricetta
          </Link>
        </div>

        {/* ======================= */}
        {/*     PREFERITI           */}
        {/* ======================= */}
        <div className="mb-5">
          <h4>❤️ Ricette preferite</h4>

          {favorites.length === 0 ? (
            <p className="text-muted">
              Non hai ancora salvato nessuna ricetta.
            </p>
          ) : (
            <ul className="list-group">
              {favorites.map((r) => (
                <li
                  key={r.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {r.title}
                  <Link
                    to={`/recipe/${r.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Vedi
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ======================= */}
        {/*     ADMIN PANEL         */}
        {/* ======================= */}
        {user.role === "ADMIN" && (
          <div className="border-top pt-4">
            <h4>👑 Pannello Admin</h4>
            <p className="text-muted">Funzionalità di moderazione in arrivo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

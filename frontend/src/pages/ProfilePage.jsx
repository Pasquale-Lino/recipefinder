import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import bgImage from "../assets/img/disposizione-degli-alimenti-conservati-sugli-scaffali.jpg";

function ProfilePage() {
  useEffect(() => {
  document.title = "Le mie ricette - Recipe Finder";
}, []);

  const { user, logout } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // ========================================================
  //   CARICA DATI PROFILO
  // ========================================================
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const recipes = await apiFetch("/recipes/me");
        setMyRecipes(recipes);

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

  // ========================================================
  //   ELIMINA RICETTA
  // ========================================================
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

  // ========================================================
  //   TOGGLE FEATURED
  // ========================================================
  const toggleFeatured = async (id) => {
  try {
    const updated = await apiFetch(`/recipes/admin/${id}/featured`, {
      method: "PUT"
    });

    // aggiorna la lista locale
    setMyRecipes(prev =>
      prev.map(r => (r.id === id ? updated : r))
    );

  } catch (err) {
    console.error("Errore toggle featured:", err);
  }
};


  // ========================================================
  //   TOGGLE PUBLIC/PRIVATE
  // ========================================================
  const togglePublic = async (id) => {
  try {
    const updated = await apiFetch(`/recipes/admin/${id}/public`, {
      method: "PUT"
    });

    setMyRecipes(prev =>
      prev.map(r => (r.id === id ? updated : r))
    );

  } catch (err) {
    console.error("Errore toggle public:", err);
  }
};


  // ========================================================
  //   SE NON LOGGATO
  // ========================================================
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
    <div
      className="customProfile"
      style={{
  backgroundImage: `
    linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
    url(${bgImage})
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  minHeight: "100vh",
  paddingTop: "40px",
  paddingBottom: "40px"
}}

    >
      <div className="container py-5">
        {/* HEADER PROFILO */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-outline">👋 Benvenuto, {user.username || user.email}</h2>
          <button className="btn btn-outline-success" onClick={logout}>
            🚪 Esci
          </button>
        </div>

        {/* ======================= */}
        {/*    LE MIE RICETTE      */}
        {/* ======================= */}
        <div className="mb-5">
          <h4 className="text-outline">📒 Le mie ricette</h4>

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

                      <div className="mt-3 d-flex flex-wrap gap-2 justify-content-between">

  <Link
    to={`/recipe/${r.id}`}
    className="btn btn-primary btn-sm"
  >
    👁️ Vedi
  </Link>

  <Link
    to={`/edit-recipe/${r.id}`}
    className="btn btn-warning btn-sm"
  >
    ✏️ Modifica
  </Link>

  <button
    className={`btn btn-sm ${r.featured ? "btn-warning" : "btn-outline-warning"}`}
    onClick={() => toggleFeatured(r.id)}
  >
    ⭐ {r.featured ? "In Homepage" : "Featured"}
  </button>

  <button
    className={`btn btn-sm ${r.publicRecipe ? "btn-success" : "btn-outline-secondary"}`}
    onClick={() => togglePublic(r.id)}
  >
    🌍 {r.publicRecipe ? "Pubblica" : "Privata"}
  </button>

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

          <Link to="/create-recipe" className="btn btn-success mt-3 text-outline">
            ➕ Crea una nuova ricetta
          </Link>
        </div>

        {/* ======================= */}
        {/*     PREFERITI           */}
        {/* ======================= */}
        <div className="mb-5">
          <h4 className="text-outline">❤️ Ricette preferite</h4>

          {favorites.length === 0 ? (
            <p className="text-muted text-outline">
              Non hai ancora salvato nessuna ricetta.
            </p>
          ) : (
            <ul className="list-group">
              {favorites.map((r) => (
                <li
                  key={r.id}
                  className="list-group-item d-flex justify-content-between align-items-center  text-preferiti"
                >
                  {r.title}
                  <Link
                    to={`/recipe/${r.id}`}
                    className="btn btn-primary btn-sm"
                  >
                   👁️ Vedi
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
          <div className="border-top pt-4 text-outline">
            <h4>👑 Pannello Admin</h4>
            <p className=" text-outline text-muted">Funzionalità di moderazione in arrivo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

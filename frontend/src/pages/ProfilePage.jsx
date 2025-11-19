import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/api"; // ⬅ usa apiFetch per il token JWT

function ProfilePage() {
  const { user, logout } = useAuth(); // 🔐 user contiene { id, email, token }
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 🟦 Al mount carichiamo ricette e preferiti
  useEffect(() => {
    // Se l'utente non è loggato → non fare nulla
    if (!user) return;

    const loadData = async () => {
      // 🔹 RICETTE SALVATE IN LOCALE
      const savedRecipes = JSON.parse(localStorage.getItem("myRecipes") || "[]");
      setMyRecipes(savedRecipes);

      // 🔹 VERIFICA CHE user.id ESISTA
      if (!user.id) {
        console.error("❌ ERRORE: user.id è undefined! User ricevuto:", user);
        return;
      }

      try {
        // 🔥 CHIAMATA PROTETTA AL BACKEND CON JWT
        const data = await apiFetch(`/favorites/${user.id}`);
        setFavorites(data);
      } catch (error) {
        console.error("❌ Errore nel caricamento dei preferiti:", error);
      }
    };

    loadData();
  }, [user]);

  // 🔐 Se non sei loggato → mostra invito al login
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
        {/* 👤 Header profilo */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>👋 Benvenuto, {user.username || user.email}</h2>
          <button className="btn btn-outline-success" onClick={logout}>
            🚪 Esci
          </button>
        </div>

        <div className="row">
          {/* 📒 --- LE MIE RICETTE --- */}
          <div className="col-md-6 mb-4">
            <h4>📒 Le mie ricette</h4>

            {myRecipes.length === 0 ? (
              <p className="text-muted">Nessuna ricetta creata finora.</p>
            ) : (
              <ul className="list-group mb-3">
                {myRecipes.map((r, i) => (
                  <li key={i} className="list-group-item">
                    {r.title}
                  </li>
                ))}
              </ul>
            )}

            <Link to="/create-recipe" className="btn btn-success mt-2">
              ➕ Crea una nuova ricetta
            </Link>
          </div>

          {/* ❤️ --- RICETTE PREFERITE --- */}
          <div className="col-md-6 mb-4">
            <h4>❤️ Ricette preferite</h4>

            {favorites.length === 0 ? (
              <p className="text-muted">Non hai ancora salvato nessuna ricetta.</p>
            ) : (
              <ul className="list-group">
                {favorites.map((r) => (
                  <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {r.title}
                    <Link to={`/recipe/${r.id}`} className="btn btn-sm btn-outline-primary">
                      Vedi
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 👑 ADMIN PANEL (se utente è admin) */}
        {user.role === "ADMIN" && (
          <div className="border-top pt-4 mt-4">
            <h4>👑 Pannello Admin</h4>
            <p className="text-muted">Funzionalità di moderazione in arrivo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

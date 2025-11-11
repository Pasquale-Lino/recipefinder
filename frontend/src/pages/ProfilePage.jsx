// src/pages/ProfilePage.jsx
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function ProfilePage() {
  const { user, logout } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 🔹 Carica ricette create e preferiti dal DB
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const savedRecipes = JSON.parse(localStorage.getItem("myRecipes") || "[]");
      setMyRecipes(savedRecipes);

      try {
        const res = await fetch(`http://localhost:8080/api/favorites/${user.id}`);
        const data = await res.json();
        console.log("💾 Preferiti dal DB:", data);
        setFavorites(data);
      } catch (err) {
        console.error("Errore nel caricamento dei preferiti:", err);
      }
    };

    loadData();
  }, [user]);

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>👋 Benvenuto, {user.name || user.email}</h2>
          <button className="btn btn-outline-success" onClick={logout}>
            🚪 Esci
          </button>
        </div>

        <div className="row">
          {/* 📒 Le mie ricette */}
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

          {/* ❤️ Preferiti */}
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

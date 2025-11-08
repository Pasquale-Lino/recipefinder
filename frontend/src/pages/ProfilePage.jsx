// src/components/ProfilePage.jsx
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function ProfilePage() {
  const { user, logout } = useAuth();

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
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👋 Benvenuto, {user.name || user.email}</h2>
        <button className="btn btn-outline-danger" onClick={logout}>
         🚪 Esci
        </button>
      </div>

      <div className="mb-5">
        <h4>⭐ Ricette preferite</h4>
        <p className="text-muted">Non hai ancora salvato nessuna ricetta.</p>
      </div>

      <div className="mb-5">
        <h4>📒 Le mie ricette</h4>
        <p className="text-muted">Nessuna ricetta creata finora.</p>
        <Link to="/create" className="btn btn-success mt-2">
          ➕ Crea una nuova ricetta
        </Link>
      </div>

      {user.role === "ADMIN" && (
        <div className="border-top pt-4 mt-4">
          <h4>👑 Pannello Admin</h4>
          <p className="text-muted">Funzionalità di moderazione in arrivo.</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

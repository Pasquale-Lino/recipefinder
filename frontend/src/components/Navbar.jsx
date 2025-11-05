import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Navbar globale dell'app Recipe Finder
 * - Sempre visibile
 * - Barra di ricerca in linea
 * - Brand cliccabile che porta alla home
 * - Menu a tendina per funzionalità future
 */
function Navbar({ ingredients, setIngredients, onSearch }) {
  const navigate = useNavigate();

  // Funzione per avviare la ricerca
  const handleSubmit = (e) => {
    e.preventDefault();
    if (ingredients.trim()) {
      onSearch(ingredients);
      navigate(`/search?ingredients=${encodeURIComponent(ingredients)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow sticky-top">
      <div className="container-fluid">
        {/* 🍳 Logo / Brand */}
        <span
          className="navbar-brand fw-bold me-3"
          style={{ cursor: "pointer", fontSize: "1.3rem" }}
          onClick={() => navigate("/home")}
        >
          🍳 Recipe Finder
        </span>

        {/* 🔎 Barra di ricerca */}
        <form
          className="d-flex flex-grow-1 mx-3"
          onSubmit={handleSubmit}
          style={{ maxWidth: "700px" }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Cerca per ingredienti o nome ricetta..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button className="btn btn-success ms-2" type="submit">
            Cerca
          </button>
        </form>

        {/* 📋 Menu a tendina per future opzioni */}
        <div className="dropdown">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            id="menuDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            ☰
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="menuDropdown">
            <li>
              <button className="dropdown-item" onClick={() => navigate("/recipes")}>
                📖 Tutte le ricette
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => navigate("/favorites")}>
                ❤️ Preferiti (in arrivo)
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-muted" disabled>
                ⚙️ Impostazioni (presto)
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;

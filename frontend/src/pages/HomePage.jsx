import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
/**
 * Pagina Home dell'app Recipe Finder
 * - Navbar con ricerca a scomparsa
 * - Bottoni ingredienti suddivisi per categoria
 */
function HomePage() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Categorie di ingredienti con emoji 🍳
  const ingredientCategories = {
    "🥩 Proteine": ["pollo", "manzo", "uova", "pesce", "tonno", "formaggio"],
    "🥦 Verdure": ["pomodoro", "zucchine", "carote", "cipolla", "peperoni"],
    "🍝 Pasta e Cereali": ["pasta", "riso", "farina", "pane", "patate"],
    "🧁 Dolci e Dessert": ["crema", "cioccolato", "zucchero", "burro", "latte", "miele"],
    "🌿 Spezie e Odori": ["basilico", "rosmarino", "aglio", "sale", "pepe"],
    "🍎 Frutta": ["mela", "banana", "fragole", "limone", "arancia"]
  };

  /**
   * Quando l'utente preme "Invio" nella barra di ricerca
   * → naviga alla pagina /search con query
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?ingredients=${encodeURIComponent(searchTerm)}`);
    }
  };

  /**
   * Aggiunge un ingrediente cliccato alla barra di ricerca
   */
  const addIngredient = (ingredient) => {
    setSearchTerm((prev) => (prev ? `${prev}, ${ingredient}` : ingredient));
  };

  return (
    <div className=" min-vh-100">
      {/* 🔝 Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3">
        <div className="container-fluid">
          <Link to="/home" className="navbar-brand fw-bold">
            🍳 Recipe Finder
          </Link>

          <div className="d-flex align-items-center ms-auto">
            <Link to="/home" className="btn btn-outline-light me-2">
              Home
            </Link>
            <button
              className="btn btn-outline-light"
              onClick={() => setSearchVisible(!searchVisible)}
            >
              🔍 Cerca
            </button>
          </div>
        </div>
      </nav>

      {/* 🔎 Barra di ricerca a scomparsa */}
      {searchVisible && (
        <div className="bg-dark py-3 shadow-sm">
          <div className="container">
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control me-2"
                placeholder="Cerca ricette o ingredienti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-warning fw-bold">
                Cerca
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🏠 Contenuto Home */}
      <div className="container py-5">
        <h1 className="text-center mb-4">Scegli gli ingredienti 🍽️</h1>
        <h6 className="text-center text-muted mb-5">
          Seleziona gli ingredienti per cercare le ricette ideali.  
          Clicca sui bottoni per aggiungerli alla barra di ricerca!
        </h6>

        {/* Categorie di ingredienti */}
        {Object.entries(ingredientCategories).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h4 className="mb-3">{category}</h4>
            <div className="d-flex flex-wrap gap-2">
              {items.map((item) => (
                <button
                  key={item}
                  className="btn btn-primary btn-sm rounded-pill px-3 py-2"
                  onClick={() => addIngredient(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Pulsante per avviare la ricerca */}
        <div className="text-center mt-5">
          <button
            className="btn btn-success btn-lg px-5"
            onClick={() => handleSearch({ preventDefault: () => {} })}
          >
            🔎 Cerca Ricette
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

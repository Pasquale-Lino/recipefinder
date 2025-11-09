// src/components/Navbar.jsx
import { useNavigate, Link } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /** Gestisce la ricerca senza ricaricare la pagina */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const resultsSection = document.getElementById("results-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* 🔝 NAVBAR PRINCIPALE */}
      <nav className="navbar navbar-dark bg-dark fixed-top shadow-sm">
        <div className="container-fluid px-4 d-flex align-items-center">
          {/* 🍳 Brand */}
          <span
            className="navbar-brand fw-bold text-warning me-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            🍳 Recipe Finder
          </span>

          {/* 🔍 Barra di ricerca */}
          <form className="d-flex flex-grow-1 me-3" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Cerca ingredienti o ricette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-warning" type="submit">
              Cerca
            </button>
          </form>

          {/* ☰ Bottone Sidebar */}
          <button
            className="btn btn-outline-light"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* 🧭 SIDEBAR */}
      <div
        className="offcanvas offcanvas-end bg-dark text-light"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarLabel"
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title text-warning" id="sidebarLabel">
            🍽️ Menu
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body">
          {/* 👤 Info utente */}
          {user ? (
            <>
              <p className="mb-3">👋 Ciao, <strong>{user.name}</strong></p>
              <button
                className="btn btn-outline-danger mb-4 w-100"
                onClick={() => {
                  logout();
                  navigate("/home");
                }}
                data-bs-dismiss="offcanvas"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn-warning mb-4 w-100"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              🔑 Accedi
            </button>
          )}

          {/* 📋 Menu link */}
          <ul className="list-unstyled">
            <li className="mb-3">
              <Link
                to="/home"
                className="text-light text-decoration-none"
                data-bs-dismiss="offcanvas"
              >
                🏠 Home
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/home"
                className="text-light text-decoration-none"
                data-bs-dismiss="offcanvas"
              >
                🔍 Cerca ricette
              </Link>
            </li>

            {/* 👤 Mostra solo se loggato */}
            {user && (
              <>
                <li className="mb-3">
                  <Link
                    to="/profile"
                    className="text-light text-decoration-none"
                    data-bs-dismiss="offcanvas"
                  >
                    👤 Il mio profilo
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    to="/my-recipes"
                    className="text-light text-decoration-none"
                    data-bs-dismiss="offcanvas"
                  >
                    📖 Le mie ricette
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    to="/favorites"
                    className="text-light text-decoration-none"
                    data-bs-dismiss="offcanvas"
                  >
                    ❤️ Preferiti
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;

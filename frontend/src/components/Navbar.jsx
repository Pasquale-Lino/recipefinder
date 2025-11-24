// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import woodBg from "../assets/img/fondo-della-pavimentazione-di-struttura-di-legno-marrone.jpg";

function Navbar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (window.location.pathname !== "/home") {
      navigate("/home");

      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);

      return;
    }

    const resultsSection = document.getElementById("results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="navbar fixed-top shadow-sm"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
            url(${woodBg})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderBottom: "2px solid rgba(0,0,0,0.3)",
          color: "white",
        }}
      >
        <div className="container-fluid px-1 d-flex align-items-center">
          <span
            className="navbar-brand fw-bold me-2 text-light"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            🍳 Recipe Finder
          </span>

          <form className="d-flex flex-grow-1 me-2" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Cerca ingredienti o ricette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-light fw-bold" type="submit">
              Cerca
            </button>
          </form>

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

      {/* SIDEBAR */}
      <div
        className="offcanvas offcanvas-end text-light"
        id="sidebarMenu"
        tabIndex="-1"
        aria-labelledby="sidebarLabel"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
            url(${woodBg})
          `,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transform: "rotate(90deg)",
          transformOrigin: "center",
        }}
      >
        <div className="offcanvas-header border-bottom border-secondary" style={{ transform: "rotate(-90deg)" }}>
          <h5 className="offcanvas-title text-warning">🍽️ Menu</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body" style={{ transform: "rotate(-90deg)" }}>
          {user ? (
            <>
              <p className="mb-3">
                👋 Ciao, <strong>{user.username || user.email}</strong>
              </p>
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
            <>
              <button
                className="btn btn-warning mb-2 w-100"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                🔑 Accedi
              </button>
              <button
                className="btn btn-outline-light mb-4 w-100"
                onClick={() => navigate("/register")}
                data-bs-dismiss="offcanvas"
              >
                📝 Registrati
              </button>
            </>
          )}

          <ul className="list-unstyled">
            <li className="mb-3">
              <button
                className="btn btn-link text-light p-0"
                onClick={() => navigate("/home")}
                data-bs-dismiss="offcanvas"
              >
                🏠 Home
              </button>
            </li>

            {user && (
              <>
                <li className="mb-3">
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => navigate("/profile")}
                    data-bs-dismiss="offcanvas"
                  >
                    📚 Le mie ricette
                  </button>
                </li>
                <li className="mb-3">
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => navigate("/create-recipe")}
                    data-bs-dismiss="offcanvas"
                  >
                    📖 Aggiungi una ricetta
                  </button>
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

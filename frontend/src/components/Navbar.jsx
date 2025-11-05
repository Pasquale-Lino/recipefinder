import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?ingredients=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark fixed-top shadow-sm">
        <div className="container-fluid px-4 d-flex align-items-center">
          {/* 🍳 Titolo */}
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

      {/* 🧭 Sidebar (Bootstrap Offcanvas) */}
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
          <ul className="list-unstyled">
            <li className="mb-3">
              <a
                href="/home"
                className="text-light text-decoration-none"
                data-bs-dismiss="offcanvas"
              >
                🏠 Home
              </a>
            </li>
            <li className="mb-3">
              <a
                href="/search"
                className="text-light text-decoration-none"
                data-bs-dismiss="offcanvas"
              >
                🔍 Cerca ricette
              </a>
            </li>
            <li className="mb-3">
              <a
                href="/recipes"
                className="text-light text-decoration-none"
                data-bs-dismiss="offcanvas"
              >
                📖 Le mie ricette
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;

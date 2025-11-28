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

  // Se NON sei in home → torna in home
  if (window.location.pathname !== "/home") {
    navigate("/home");

    // aspetta un attimo che la pagina carichi il blocco risultati
    setTimeout(() => {
      const resultsSection = document.getElementById("results-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);

    return;
  }

  // Se sei già in home → scrolla normalmente
  const resultsSection = document.getElementById("results-section");
  if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }
};



  return (
    <>
      <nav
  className="navbar fixed-top shadow-sm"
  style={{
    backgroundImage: `url(${woodBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderBottom: "2px solid rgba(0,0,0,0.3)"
  }}
>

        <div className="container-fluid px-1 d-flex align-items-center">
          <span
            className="navbar-brand fw-bold me-4 text-outline text-light"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            🍳 Recipe Finder
          </span>
          {/* <button
            className="btn btn-outline-light m-1"
            onClick={() => navigate("/home")}
          >
            🏠 Home
          </button> */}

          <form className="form d-flex flex-grow-1 me-2" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Cerca ingredienti o ricette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-light text-outline fw-bold" type="submit">
             Cerca
            </button>
          </form>

          {/* FOTO PROFILO PICCOLA (solo se loggato) */}
{user && (
  <img
    src={user.profileImage || "https://via.placeholder.com/40"}
    alt="avatar"
    className="rounded-circle me-2"
    style={{
      width: "40px",
      height: "40px",
      objectFit: "cover",
      border: "2px solid white",
      cursor: "pointer"
    }}
    onClick={() => navigate("/profile")}
  />
)}

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

      <div
        className="offcanvas offcanvas-end bg-dark text-light"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarLabel"
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title text-light" id="sidebarLabel">
            🍽️ Menu
          </h5>
        
          
            <div className="d-flex align-items-center gap-2 btn-logout">
      {/* 🔥 LOGOUT IN ALTO A DESTRA */}
      {user && (
        <button
          className="btn  btn-sm btn-outline-danger"
          onClick={() => {
            logout();
            navigate("/home");
          }}
          data-bs-dismiss="offcanvas"
        >
          🚪 Logout
        </button>
      )}

      {/* ❌ BOTTONE CHIUDI */}
      <button
        type="button"
        className="btn-close btn-close-white"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
  </div>
       

        <div className="offcanvas-body">
          {/* 👤 Info utente */}
          {user ? (
  <>
    {/* FOTO PROFILO GRANDE */}
    <div className="text-center mb-3">
      <img
        src={user.profileImage || "https://via.placeholder.com/120"}
        alt="avatar"
        className="rounded-circle"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          border: "3px solid #fff"
        }}
      />
    </div>

    <p className="text-center mb-3">
      👋 Ciao, <strong>{user.firstName || user.username || user.email}</strong>
    </p>
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

          {/* 📋 Menu link */}
          <ul className="list-unstyled">
            <li className="mb-3">
              <button
                className="sidebar-link"
                data-bs-dismiss="offcanvas"
                onClick={() => navigate("/home")}
              >
                🏠 Home
              </button>
            </li>
            
            {user && (
              <>
              
                <li className="mb-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="sidebar-link"
                    data-bs-dismiss="offcanvas"
                  >
                    👤 Profilo
                  </button>
                </li>
                <li className="mb-3">
                  <button
                    onClick={() => navigate("/create-recipe")}
                    className="sidebar-link"
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

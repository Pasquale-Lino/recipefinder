import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

function LoginModal() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // data = { error: "qualcosa" }
      setError(data.error || "Credenziali non valide");
      return;
    }

    // Login riuscito → data = { id, email, token, ecc }
    login(data);

    // chiudi modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
    modal.hide();

    window.location.href = "/profile";

  } catch (err) {
    console.error(err);
    setError("Errore di connessione");
  }
};


  return (
    <div className="modal fade" id="loginModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-light">

          <div className="modal-header">
            <h5 className="modal-title text-warning">Accedi 🔐</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="btn btn-warning w-100">Login</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;

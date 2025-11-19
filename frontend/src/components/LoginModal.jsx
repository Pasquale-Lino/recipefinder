// LoginModal.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

function LoginModal() {

  const { login } = useAuth();

  // 💾 Campi del form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ⚠️ Per mostrare eventuali errori
  const [error, setError] = useState("");

  // 📌 Gestione submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔥 Chiamata API al backend
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 🟡 Il backend può rispondere con TESTO, quindi leggiamo text()
      const text = await res.text();

      // ❌ Se la response NON è OK, text contiene un messaggio ES. "Password errata"
      if (!res.ok) {
        setError(text);
        return;
      }

      // 🟢 Se OK → text contiene un JSON valido → lo convertiamo
      const data = JSON.parse(text);

      // Ora data = { id, email, role, token }
      login(data);

      // Chiudi il modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
      modal.hide();

      window.location.href = "/profile";

    } catch (err) {
      console.error(err);
      setError("Errore di connessione al server");
    }
  };

  return (
    <div className="modal fade" id="loginModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-light">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title text-warning">Accedi 🔐</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* ❗ Mostra errori */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* FORM LOGIN */}
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

// src/pages/VerifyPage.jsx
import { useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      console.log("VERIFY RESPONSE:", res);

      // ⚡ LOGIN AUTOMATICO
      login(res.user, res.token);

      setSuccess("Verifica completata! Accesso automatico effettuato.");

      // attendo un attimo per mostrare il messaggio
      setTimeout(() => navigate("/profile"), 500);

    } catch (err) {
      console.error(err);
      setError(err.message || "Codice non valido.");
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2>Verifica il tuo account</h2>
      <p>Inserisci il codice che hai ricevuto via email</p>

      <form onSubmit={handleVerify} className="mt-3" style={{ maxWidth: "300px" }}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Codice di verifica"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <button className="btn btn-warning w-100" type="submit">
          Verifica e accedi
        </button>
      </form>
    </div>
  );
}

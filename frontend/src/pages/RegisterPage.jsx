import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();

  // campi del form
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); 

  // 🔥 nuovo stato per mostrare BOX verifica codice
  const [awaitingVerify, setAwaitingVerify] = useState(false);
  const [otp, setOtp] = useState("");

  // aggiorna i campi del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // REGISTRAZIONE
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const text = await res.text();
      console.log("📨 Register response:", text);

      if (res.ok) {
        setSuccess(
          "✅ Registrazione completata! Ti abbiamo inviato un codice di verifica via email."
        );

        // 🔥 Mostra input codice
        setAwaitingVerify(true);

        // salva email per la verifica
        localStorage.setItem("pendingEmail", form.email);
      } else {
        setError(text || "Errore durante la registrazione");
      }
    } catch (err) {
      console.error(err);
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // VERIFICA CODICE OTP
  // -----------------------------

const handleVerifyCode = async () => {
  setError("");
  setSuccess("");

  const email = localStorage.getItem("pendingEmail");

  try {
    const res = await fetch("http://localhost:8080/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: otp }),
    });

    const data = await res.json();
    console.log("🟦 Verify response:", data);

    if (!res.ok) {
      setError(data.error || "Codice non valido");
      return;
    }

    // 🔥 LOGIN AUTOMATICO
// data = { message, user, token }
login(data.user, data.token);


setSuccess("🎉 Verifica completata! Accesso effettuato...");

// redirect dopo login
setTimeout(() => navigate("/profile"), 1500);

  } catch (err) {
    console.error(err);
    setError("Errore di connessione");
  }
};


  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="container py-5 customProfile">
      <h2 className="mb-4 text-center">Crea un nuovo account 👨‍🍳</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* 🔥 FASE 1 — FORM REGISTRAZIONE */}
      {!awaitingVerify && (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
          <div className="mb-3">
            <label className="form-label">Nome utente</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Conferma password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Registrazione..." : "Registrati"}
          </button>

          <p className="mt-3 mb-0 text-center text-muted">
            Dopo la registrazione ti invieremo un <strong>codice di verifica</strong> via email ✉️
          </p>
        </form>
      )}

      {/* 🔥 FASE 2 — INSERIMENTO CODICE */}
      {awaitingVerify && (
        <div className="mx-auto mt-4" style={{ maxWidth: "400px" }}>
          <h4 className="text-center mb-3">Inserisci il codice di verifica 🔢</h4>

          <input
            type="text"
            className="form-control text-center fs-4 mb-3"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="btn btn-primary w-100" onClick={handleVerifyCode}>
            Verifica codice
          </button>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;

/*
✅ Messaggio “ti abbiamo inviato un codice”
⬇️
📥 Appare l’input: “Inserisci il codice di verifica”
⬇️
🔐 Chiami /api/auth/verify-code
⬇️
✔ Utente verificato
⬇️
▶ Redirect a Home (o login)
*/
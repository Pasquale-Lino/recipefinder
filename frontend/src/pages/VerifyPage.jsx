import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const [status, setStatus] = useState("Verifica in corso...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("Token non valido.");
      return;
    }

    fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
      .then((res) => res.text())
      .then((msg) => {
        setStatus(msg);

        // ⏳ Dopo 3 secondi torna al login/modal
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      })
      .catch(() => setStatus("Errore durante la verifica."));
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2>{status}</h2>
      <p>Verrai reindirizzato automaticamente...</p>
    </div>
  );
}

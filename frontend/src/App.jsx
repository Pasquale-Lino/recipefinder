import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  const [message, setMessage] = useState("");
  const [postResponse, setPostResponse] = useState("");

  // GET semplice per test
  useEffect(() => {
    apiFetch("/test")
      .then((data) => setMessage(data))
      .catch((err) => console.error("Errore GET:", err));
  }, []);

  // Simula invio dati al backend
  const inviaRicetta = () => {
    const nuovaRicetta = {
      titolo: "Spaghetti alla carbonara",
      ingredienti: ["spaghetti", "uova", "guanciale", "pecorino", "pepe"],
    };

    apiFetch("/recipes", {
      method: "POST",
      body: JSON.stringify(nuovaRicetta),
    })
      .then((data) => setPostResponse(JSON.stringify(data)))
      .catch((err) => setPostResponse("Errore: " + err.message));
  };

  return (
    
    <div>
      <h1>Home - Recipe Finder</h1>
      <p>Benvenuto nella tua app di ricette 🍳</p>
      <Link to="/recipes">Vai alla lista ricette</Link>
      <h3>✅ Test Comunicazione Backend-Frontend</h3>
      <p>{message}</p>

      <button onClick={inviaRicetta}>Invia ricetta di test</button>

      {postResponse && (
        <div style={{ marginTop: "1rem", color: "green" }}>
          <strong>Risposta dal backend:</strong>
          <pre>{postResponse}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

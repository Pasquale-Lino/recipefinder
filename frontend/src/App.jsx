import { useState } from "react";
import { apiFetch } from "./api/api";
import "./styles/global.css";
import { Link } from "react-router-dom";

function App() {
  const [message] = useState("");
  const [postResponse, setPostResponse] = useState("");



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
      <p>Scegli cosa fare:</p>
      <ul>
        <li><Link to="/recipes">Vedi tutte le ricette</Link></li>
        <li><Link to="/search">Cerca per ingredienti</Link></li>
      </ul>
      <Link to="/recipes">Vai alla lista ricette</Link>
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

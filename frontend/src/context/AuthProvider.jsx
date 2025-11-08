import { useState, useEffect } from "react"; 
import { AuthContext } from "./AuthContext"; 

// Componente che avvolge la tua app e fornisce user/login/logout a tutti i discendenti
export const AuthProvider = ({ children }) => {
  // Stato globale dell'utente (null = non loggato)
  const [user, setUser] = useState(null);

  // All'avvio, prova a recuperare l'utente salvato nel localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user"); // legge una stringa (o null)
    if (saved) setUser(JSON.parse(saved));      // se esiste, la converte in oggetto e la mette nello stato
  }, []); // [] = esegui solo al montaggio

  // Finta funzione di login: crea un "utente" e lo persiste in localStorage
  const login = (email) => {
    const fakeUser = {
      email,                      // es: "admin@demo.it"
      name: "Utente Demo",        // nome dimostrativo
      role: email === "admin@demo.it" ? "ADMIN" : "USER", // regola semplice per ruolo
    };
    localStorage.setItem("user", JSON.stringify(fakeUser)); // persiste
    setUser(fakeUser); // aggiorna lo stato globale => tutta l'app si aggiorna
  };

  // Logout: svuota localStorage e stato
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Rende disponibili user, login, logout a tutti i componenti figli avvolti da AuthProvider
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

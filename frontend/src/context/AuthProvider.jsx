import { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Al primo render, carica l'utente dal localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false); // 🔚 segna caricamento terminato
  }, []);

  // ✅ Finto login demo
  const login = (email) => {
    const fakeUser = {
      email,
      name: "Utente Demo",
      role: email === "admin@demo.it" ? "ADMIN" : "USER",
    };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ Se stiamo ancora caricando, mostra uno spinner temporaneo
  if (loading) {
    return (
      <div className="text-center mt-5 text-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p className="mt-2">Caricamento sessione...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>

      {children}
    </AuthContext.Provider>
  );
};

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth(); // 👈 leggiamo anche loading

  // ⏳ Mostra un mini loader finché AuthProvider non ha finito
  if (loading) {
    return (
      <div className="text-center text-light mt-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p>Verifica sessione...</p>
      </div>
    );
  }

  // ❌ Non loggato → torna alla home
  if (!user) return <Navigate to="/home" replace />;

  // ❌ Ruolo non autorizzato → torna alla home
  if (role && user.role !== role) return <Navigate to="/home" replace />;

  // ✅ Ok → mostra la pagina protetta
  return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  // non loggato ➜ rimanda a /home
  if (role && user.role !== role) return <Navigate to="/home" replace />; 
  
  //loggato ma ruolo sbagliato
  if (!user) return <Navigate to="/home" replace />;

  return children; // ok
}

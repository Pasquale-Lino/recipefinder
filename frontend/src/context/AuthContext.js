// src/context/AuthContext.jsx
import { createContext, useContext } from 'react';
// ⭐ CREA IL CONTESTO E L’HOOK DI COMODO QUI

export const AuthContext = createContext();
// ⭐ QUI AGGIUNGIAMO L’HOOK MANCANTE
// Piccolo hook di comodo: lo usi nei componenti per leggere { user, login, logout }
export const useAuth = () => useContext(AuthContext);

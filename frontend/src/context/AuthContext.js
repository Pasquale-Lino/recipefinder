import { createContext } from 'react';
// Crea il contesto dell'autenticazione.
// Il valore di default è undefined: verrà riempito dall'AuthProvider.
// Questo contesto conterrà informazioni sull'utente autenticato e metodi per il login/logout.
export const AuthContext = createContext(null);

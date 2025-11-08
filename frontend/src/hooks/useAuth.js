import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Piccolo hook di comodo: lo usi nei componenti per leggere { user, login, logout }
export const useAuth = () => useContext(AuthContext);

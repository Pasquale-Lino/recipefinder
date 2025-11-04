// src/api/api.js

// 🔹 URL base del backend
const API_BASE_URL = 'http://localhost:8080/api';

// 🔹 Credenziali temporanee per autenticazione di base (solo per test)
const username = 'user';
const password = '123456';

// btoa() codifica una stringa in Base64 (obbligatoria per Basic Auth)
const authHeader = 'Basic ' + btoa(`${username}:${password}`); // In questo esempio usiamo l'autenticazione di base con username e password fissi

// Codifica in Base64 delle credenziali per l'intestazione di autorizzazione
//TODO: const authHeader = "Bearer " + localStorage.getItem("jwt");
// Nota: in futuro, per una maggiore sicurezza, uso il token JWT o OAuth invece di credenziali fisse.

/**
 * Esegue una chiamata al backend con autenticazione e gestione errori
 *
 * @param {string} endpoint - endpoint API (es: "/test" o "/recipes")
 * @param {object} [options={}] - opzioni fetch (metodo, corpo, headers)
 * @returns {Promise<any>} - risposta in JSON o testo
 *
 * Uso tipico:
 *   apiFetch("/test")
 *   apiFetch("/recipes", { method: "POST", body: JSON.stringify(dati) })
 */
export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      ...options.headers, // permette di sovrascrivere o aggiungere header
    },
    ...options,
  });
  // Funzione per effettuare richieste API con autenticazione di base
  // Restituisce la risposta in formato JSON o testo
  // endpoint: string - l'endpoint API (es. "/test")
  // options: object - opzioni aggiuntive per fetch (es. metodo, corpo, headers)

  // 🚨 Gestione errori HTTP (es. 400, 403, 500)
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Errore HTTP ${response.status}: ${errorText}`);
  }
  const text = await response.text();

  //🔄 Proviamo a restituire ...
  try {
    return JSON.parse(text); // Se è JSON, lo restituiamo come oggetto
  } catch {
    return text; // Altrimenti restituiamo il testo puro
  }
}

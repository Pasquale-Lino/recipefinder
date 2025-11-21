// src/api/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export async function apiFetch(endpoint, options = {}) {
  // 🔐 Leggo il token salvato dal login/verifica
  const token = localStorage.getItem('token');
  console.log('🔑 apiFetch – token letto da localStorage:', token);

  // 🔧 Costruisco gli header unendo quelli passati + Authorization
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text(); // leggiamo il body UNA sola volta

  if (!response.ok) {
    // 🔴 In caso di errore, butto un errore con il testo del backend
    throw new Error(bodyText || `Errore API (${response.status})`);
  }

  // Se il backend ha mandato JSON lo parse-iamo, altrimenti stringa
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(bodyText);
    } catch {
      return bodyText;
    }
  }
  console.log('🔑 apiFetch – token letto da localStorage:', token);

  return bodyText;
}

// src/api/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 🛑 SE IL TOKEN È SCADUTO O INVALIDO → logout automatico
  if (response.status === 401 || response.status === 403) {
    console.warn('⛔ Token scaduto o invalido. Logout automatico.');

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Rimanda alla home e forza il refresh
    window.location.href = '/home';

    return; // interrompe la funzione
  }

  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(bodyText || `Errore API (${response.status})`);
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(bodyText);
    } catch {
      return bodyText;
    }
  }

  return bodyText;
}

import React from "react";
import { useEffect } from "react";
function PrivacyPolicy() {
    useEffect(() => {
  document.title = "Policy - Recipe Finder";
}, []);

  return (
    <div className="legal-page container py-5 text-light">
      <h1 className="text-outline mb-4">Informativa sulla Privacy</h1>

      <p>
        La presente informativa descrive le modalità di trattamento dei dati personali 
        degli utenti che utilizzano il servizio <strong>RecipeFinder</strong>.
      </p>

      <h3 className="mt-4">1. Titolare del trattamento</h3>
      <p>
        Il titolare del trattamento dei dati è l’amministratore del progetto
        RecipeFinder. Per informazioni o richieste: <strong>support@recipefinder.com</strong>.
      </p>

      <h3 className="mt-4">2. Dati raccolti</h3>
      <ul>
        <li>Dati identificativi: nome, email, username</li>
        <li>Dati tecnici: indirizzo IP, tipo di browser, informazioni di utilizzo</li>
        <li>Dati forniti volontariamente: ricette create, preferiti salvati</li>
      </ul>

      <h3 className="mt-4">3. Finalità del trattamento</h3>
      <ul>
        <li>Registrazione e autenticazione dell'utente</li>
        <li>Funzionamento del servizio e personalizzazione contenuti</li>
        <li>Statistiche interne e miglioramento del servizio</li>
      </ul>

      <h3 className="mt-4">4. Conservazione dei dati</h3>
      <p>
        I dati vengono conservati per il tempo strettamente necessario a fornire il servizio 
        o fino alla richiesta di cancellazione da parte dell’utente.
      </p>

      <h3 className="mt-4">5. Diritti dell’utente</h3>
      <p>
        L’utente può richiedere in qualsiasi momento:
      </p>
      <ul>
        <li>Accesso ai propri dati</li>
        <li>Modifica o cancellazione</li>
        <li>Portabilità dei dati</li>
      </ul>

      <h3 className="mt-4">6. Sicurezza</h3>
      <p>
        Tutti i dati sono protetti tramite crittografia, HTTPS e misure tecniche adeguate.
      </p>

      <h3 className="mt-4">7. Modifiche alla Privacy Policy</h3>
      <p>
        Questa informativa può essere aggiornata. L’utente verrà informato in caso di cambiamenti rilevanti.
      </p>

      <p className="mt-5">
        Ultimo aggiornamento: <strong>{new Date().toLocaleDateString()}</strong>
      </p>
    </div>
  );
}

export default PrivacyPolicy;

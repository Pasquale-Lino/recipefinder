import React from "react";
import { useEffect } from "react";
function TermsAndConditions() {
    useEffect(() => {
  document.title = "Terms - Recipe Finder";
}, []);

  return (
    <div className="legal-page container py-5 text-light">
      <h1 className="text-outline mb-4">Termini e Condizioni</h1>

      <p>
        L’utilizzo di <strong>RecipeFinder</strong> implica l’accettazione 
        dei presenti Termini e Condizioni.
      </p>

      <h3 className="mt-4">1. Uso consentito</h3>
      <p>
        L’utente si impegna a utilizzare il servizio in modo lecito e nel rispetto 
        delle normative vigenti.
      </p>

      <h3 className="mt-4">2. Contenuti generati dagli utenti</h3>
      <ul>
        <li>L’utente è responsabile delle ricette che pubblica.</li>
        <li>Non sono ammessi contenuti offensivi o illegali.</li>
      </ul>

      <h3 className="mt-4">3. Limitazioni di responsabilità</h3>
      <p>
        RecipeFinder non è responsabile per eventuali danni derivanti da:
      </p>
      <ul>
        <li>Informazioni errate nelle ricette</li>
        <li>Malfunzionamenti temporanei del servizio</li>
        <li>Uso improprio da parte dell’utente</li>
      </ul>

      <h3 className="mt-4">4. Sospensione degli account</h3>
      <p>
        Un account può essere sospeso in caso di violazioni delle regole.
      </p>

      <h3 className="mt-4">5. Proprietà intellettuale</h3>
      <p>
        Il design, il logo e il software sono protetti da copyright.
      </p>

      <h3 className="mt-4">6. Modifiche ai Termini</h3>
      <p>
        I termini possono essere aggiornati in qualsiasi momento.
      </p>

      <p className="mt-5">
        Ultimo aggiornamento: <strong>{new Date().toLocaleDateString()}</strong>
      </p>
    </div>
  );
}

export default TermsAndConditions;

import React from "react";
import { useEffect } from "react";
function AboutProject() {
    useEffect(() => {
  document.title = "About Us - Recipe Finder";
}, []);

  return (
    <div className="legal-page container py-5 text-light">
      <h1 className="text-outline mb-4">Il Progetto RecipeFinder</h1>

      <p>
        <strong>RecipeFinder</strong> è un progetto full-stack sviluppato come
        piattaforma per trovare ricette basate sugli ingredienti disponibili.
      </p>

      <h3 className="mt-4">Tecnologie utilizzate</h3>
      <ul>
        <li><strong>Frontend:</strong> React + Bootstrap</li>
        <li><strong>Backend:</strong> Spring Boot + Spring Security</li>
        <li><strong>Database:</strong> PostgreSQL</li>
        <li><strong>API esterna:</strong> Spoonacular</li>
      </ul>

      <h3 className="mt-4">Funzionalità principali</h3>
      <ul>
        <li>Cerca ricette tramite ingredienti</li>
        <li>Carosello ricette in evidenza</li>
        <li>Gestione account + autenticazione JWT</li>
        <li>Crea, modifica e cancella ricette (Admin)</li>
        <li>Ricette preferite salvabili</li>
        <li>Caricamento immagini via Cloudinary</li>
      </ul>

      <h3 className="mt-4">Obiettivo del progetto</h3>
      <p>
        Rendere semplice cucinare utilizzando ciò che hai già in casa, offrendo 
        un'esperienza intuitiva e personalizzata.
      </p>

      <p className="mt-5 text-center">🍽️ Grazie per usare RecipeFinder!</p>
    </div>
  );
}

export default AboutProject;

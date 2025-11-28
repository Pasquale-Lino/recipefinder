📘 RecipeFinder — Full-Stack Project

RecipeFinder è un’applicazione full-stack che consente agli utenti di cercare ricette, crearne di nuove, salvarle tra i preferiti e gestire il proprio profilo personale.
Il progetto è composto da:

Backend → Spring Boot (Java), PostgreSQL, Spring Security + JWT

Frontend → React + Vite

Cloud Services → Cloudinary (immagini ricette / profilo), Resend (email di verifica)

🚀 Tecnologie utilizzate
🔧 Backend (Java + Spring Boot)

Spring Boot 3

Spring Web

Spring Data JPA

Spring Security + JWT

PostgreSQL

Hibernate

Lombok

Validation API

Cloudinary API

Resend API (email di verifica)

Il backend gestisce:

autenticazione e registrazione utenti

invio codice verifica via email

CRUD ricette

sistema di preferiti

gestione profilo (nome, cognome, telefono, avatar)

ruoli (USER / ADMIN)

ricette consigliate, pubbliche, featured

🎨 Frontend (React + Vite)

React 18

Vite

React Router DOM

Bootstrap 5

Context API (AuthContext)

Fetch API personalizzata con Bearer Token

LocalStorage per persistenza login

Funzionalità principali:

registrazione + login con persistenza

verifica email tramite codice OTP

gestione profilo (modifica dati, avatar)

creazione ricette con upload immagini su Cloudinary

gestione preferiti

pagina dettagli ricetta

pannello admin (ricette in homepage, public/private, ecc.)


⚙️ Installazione & Avvio
🔹 Backend

Configurare application.properties

Avviare PostgreSQL

Eseguire:

mvn spring-boot:run


Il backend parte su:

http://localhost:8080

🔹 Frontend

Da dentro la cartella frontend/:

npm install
npm run dev


Il frontend parte su:

http://localhost:5173

🔑 Autenticazione

Il progetto utilizza JWT Bearer Token salvato in localStorage.

Ogni chiamata protegge le rotte tramite header:

Authorization: Bearer <token>

📤 Upload Immagini

Ricette → immagine caricata su Cloudinary

Profilo utente → per ora supporta URL Cloudinary (upload automatico in arrivo)
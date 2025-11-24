// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CreateRecipePage from "./pages/CreateRecipePage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginModal from "./components/LoginModal.jsx";
import RegisterPage from "./pages/RegisterPage.jsx"; 
import AuthProvider from "./context/AuthProvider.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import "./index.css";
import VerifyPage from "./pages/VerifyPage.jsx"; 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <LoginModal />
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/home" element={<HomePage />} />
              {/* Imposta HomePage come pagina di default */}
              <Route index element={<HomePage />} />
              {/* 📖 Dettagli ricetta */}
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              {/* 🔐 Pagine protette, accessibili solo da utenti loggati */}
              <Route path="/profile" element={
                <PrivateRoute><ProfilePage /></PrivateRoute>}/>
              {/* 🔐 Pagine protette, accessibili solo da utenti loggati */}
              <Route path="/create-recipe" element={
                <PrivateRoute><CreateRecipePage /></PrivateRoute>}/>
              {/* 📝 Registrazione aperta a tutti */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerifyPage />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
);

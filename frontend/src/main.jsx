// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import RecipesPage from "./pages/RecipesPage";
import SearchRecipes from "./pages/SearchRecipes";
import RecipeDetail from "./pages/RecipeDetail";
import "./styles/global.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<App />} />

        {/* Pagina elenco ricette */}
        <Route path="/recipes" element={<RecipesPage />} />

        {/* Pagina di ricerca per ingredienti */}
        <Route path="/search" element={<SearchRecipes />} />
        
        {/*Pagina di dettagli ricetta */}
        <Route path="/recipe/:id" element={<RecipeDetail />} /> 

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import RecipesPage from "./pages/RecipesPage";
import SearchRecipes from "./pages/SearchRecipes";
import HomePage from "./pages/HomePage";
import RecipeDetail from "./pages/RecipeDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/search" element={<SearchRecipes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

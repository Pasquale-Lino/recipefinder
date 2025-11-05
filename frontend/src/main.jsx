import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import SearchRecipes from "./pages/SearchRecipes";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import { SearchProvider } from "./context/SearchContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          {/*  Tutte le pagine passano da App, che contiene Navbar e Outlet */}
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<HomePage />} />
            <Route path="search" element={<SearchRecipes />} />
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  </React.StrictMode>
);

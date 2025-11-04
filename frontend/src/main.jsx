import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/recipes" element={<RecipesPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

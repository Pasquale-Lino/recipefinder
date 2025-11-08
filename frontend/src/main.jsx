// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginModal from "./components/LoginModal.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SearchProvider } from "./context/SearchContext.jsx"; // ✅ aggiunto
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider> {/* ✅ ora tutto ha accesso al searchTerm */}
        <BrowserRouter>
          <LoginModal />
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/home" element={<HomePage />} />
              <Route index element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
);

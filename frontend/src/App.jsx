// src/App.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <>
      {/* 🔝 Navbar visibile ovunque */}
      <Navbar />

      {/* 📦 Contenuto dinamico delle pagine */}
      <div className="container-fluid mt-4">
        <Outlet />
      </div>
    </>
  );
}

export default App;

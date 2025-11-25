// src/App.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <>
      {/* 🔝 Navbar visibile ovunque */}
      <Navbar />

      {/* 📦 Contenuto dinamico delle pagine */}
      <div className="container-fluid mt-4">
        <Outlet />
      </div>
      <Footer /> 
    </>
  );
}

export default App;

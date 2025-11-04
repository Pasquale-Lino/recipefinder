import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {


  return (
    <>
      <Navbar />
      <div className="container text-center mt-5">
        <h1 className="fw-bold text-success">Benvenuto in Recipe Finder 🍳</h1>
        <p className="lead text-muted">
          Scopri ricette in base agli ingredienti che hai in casa!
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          
          <Link to="/search" className="btn btn-success btn-lg">
            🔍 Cerca per ingredienti
          </Link>
        </div>

        
      </div>
    </>
  );
}

export default App;

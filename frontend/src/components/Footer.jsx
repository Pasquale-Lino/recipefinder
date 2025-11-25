import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <footer className="global-footer py-4 mt-5">
        <div className="container">
          <div className="row text-center text-md-start align-items-start">

            {/* COLONNA SINISTRA */}
            <div className="col-12 col-md-4 mb-4">
              <p className="footer-title mb-1">🍽️ RecipeFinder</p>
              <p className="footer-subtitle">Le ricette che ami, sempre con te.</p>
            </div>

            {/* COLONNA CENTRALE */}
            <div className="col-12 col-md-4 mb-4 text-center">
              

              <div className="d-flex flex-column gap-2">
                <a href="/privacy" className="footer-link">
                  <i className="bi bi-shield-lock-fill me-1"></i>
                  Informativa Privacy
                </a>

                <a href="/termini" className="footer-link">
                  <i className="bi bi-file-earmark-text me-1"></i>
                  Termini e Condizioni
                </a>

                <a href="/progetto" className="footer-link">
                  <i className="bi bi-info-circle-fill me-1"></i>
                  Il progetto
                </a>
              </div>
            </div>

            {/* COLONNA DESTRA */}
            <div className="col-12 col-md-4 mb-4 text-center text-md-end">
              

              <div className="d-flex justify-content-center justify-content-md-end gap-3">
                <a href="#" className="social-icon">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="bi bi-tiktok"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>

          </div>

          <p className="footer-copy text-center mt-3 mb-0">
            © {new Date().getFullYear()} RecipeFinder — Tutti i diritti riservati
          </p>
        </div>
      </footer>

      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </>
  );
}

export default Footer;

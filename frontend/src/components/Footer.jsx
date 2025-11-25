// src/components/Footer.jsx
export default function Footer() {

  // Attiva scroll-to-top quando si clicca il bottone
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="global-footer text-center py-5 mt-5">

      <div className="container">
        
        {/* 🥄 Branding */}
        <p className="footer-title mb-1">🍽️ RecipeFinder</p>
        <p className="footer-subtitle mb-3">
          Le ricette che ami, sempre con te.
        </p>

        {/* 🌐 Social icons */}
        <div className="footer-social d-flex justify-content-center gap-4 mb-4">

          <a href="#" className="social-icon instagram" title="Instagram">
            <i className="bi bi-instagram"></i>
          </a>

          <a href="#" className="social-icon facebook" title="Facebook">
            <i className="bi bi-facebook"></i>
          </a>

          <a href="#" className="social-icon youtube" title="YouTube">
            <i className="bi bi-youtube"></i>
          </a>

          <a href="#" className="social-icon tiktok" title="TikTok">
            <i className="bi bi-tiktok"></i>
          </a>

        </div>

        {/* ⚖️ Link legali */}
        <div className="footer-links d-flex justify-content-center gap-4 mb-3">
          <a href="#" className="footer-link">Informativa Privacy</a>
          <a href="#" className="footer-link">Termini di Servizio</a>
          <a href="#" className="footer-link">Informazioni Legali</a>
        </div>

        {/* 🔼 Torna su */}
        <button className="back-to-top-btn mt-3" onClick={scrollToTop}>
          ⬆️ Torna su
        </button>

        {/* 📄 Copyright */}
        <p className="footer-copy mt-4 mb-0">
          © {new Date().getFullYear()} RecipeFinder — Tutti i diritti riservati
        </p>

      </div>
    </footer>
  );
}

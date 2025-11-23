import { useSearch } from "../context/SearchContext";
import { apiFetch } from "../api/api";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { translateText } from "../utils/translate";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function HomePage() {
  const { searchTerm, setSearchTerm } = useSearch();

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [featured, setFeatured] = useState([]); // ⬅️ QUI ORA ESISTE ED È USATO
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // 📌 Carica ricette featured dal backend
  useEffect(() => {
    apiFetch("/recipes/featured")
      .then((data) => setFeatured(data))
      .catch((err) => console.error("Errore featured:", err));
  }, []);
  
  // Categorie con emoji 🍳
const ingredientCategories = {
  "🥩 Carne, Pesce, Latticini...": [
    { label: "🐓 pollo", value: "pollo" },
    { label: "🐄 manzo", value: "manzo" },
    { label: "🥚 uova", value: "uova" },
    { label: "🐟 pesce", value: "pesce" },
    { label: "🐖 maiale", value: "maiale" },
    { label: "🍗 tacchino", value: "tacchino" },
    { label: "🧀 formaggio", value: "formaggio" },
    { label: "⚪ mozzarella", value: "mozzarella" },
    { label: "🐟 tonno", value: "tonno" },
    { label: "🍤 gamberi", value: "gamberi" },
    { label: "🦑 calamari", value: "calamari" },
    { label: "🐚 cozze", value: "cozze" },
    { label: "🥩 vitello", value: "vitello" },
    { label: "🥓 pancetta", value: "pancetta" },
    { label: "🍖 prosciutto", value: "prosciutto" },
  ],

  "🥦 Verdure": [
    { label: "🍅 pomodoro", value: "pomodoro" },
    { label: "🥒 zucchine", value: "zucchine" },
    { label: "🥕 carote", value: "carote" },
    { label: "🧅 cipolla", value: "cipolla" },
    { label: "🌶 peperone", value: "peperone" },
    { label: "🥬 lattuga", value: "lattuga" },
    { label: "🥔 patate", value: "patate" },
    { label: "🥦 broccoli", value: "broccoli" },
    { label: "🥗 spinaci", value: "spinaci" },
    { label: "🍆 melanzane", value: "melanzane" },
    { label: "🌽 mais", value: "mais" },
    { label: "🧄 aglio", value: "aglio" },
    { label: "🌶 peperoncino", value: "peperoncino" },
  ],

  "🍝 Pasta e Cereali": [
    { label: "🍝 pasta", value: "pasta" },
    { label: "🍚 riso", value: "riso" },
    { label: "🌾 farina", value: "farina" },
    { label: "🍞 pane", value: "pane" },
    { label: "🥐 pasta sfoglia", value: "pasta sfoglia" },
    { label: "🥖 baguette", value: "baguette" },
    { label: "🥨 grissini", value: "grissini" },
    { label: "🥯 panini", value: "panini" },
    { label: "🍘 couscous", value: "couscous" },
    { label: "🍜 spaghetti", value: "spaghetti" },
    { label: "🥔 gnocchi", value: "gnocchi" },
  ],

  "🧁 Dolci e Dessert": [
    { label: "🍫 cioccolato", value: "cioccolato" },
    { label: "🍮 zucchero", value: "zucchero" },
    { label: "🍰 panna", value: "panna" },
    { label: "🍦 gelato", value: "gelato" },
    { label: "🥛 latte", value: "latte" },
    { label: "🧈 burro", value: "burro" },
    { label: "🍯 miele", value: "miele" },
    { label: "🍓 marmellata", value: "marmellata" },
    { label: "🧁 crema pasticcera", value: "crema pasticcera" },
    { label: "🍋 scorza di limone", value: "scorza di limone" },
  ],

  "🌿 Spezie e Odori": [
    { label: "🌿 basilico", value: "basilico" },
    { label: "🌿 prezzemolo", value: "prezzemolo" },
    { label: "🌿 rosmarino", value: "rosmarino" },
    { label: "🌿 timo", value: "timo" },
    { label: "🌿 origano", value: "origano" },
    { label: "🧄 aglio", value: "aglio" },
    { label: "🧅 cipolla", value: "cipolla" },
    { label: "💎 sale", value: "sale" },
    { label: "🧂 sale grosso", value: "sale grosso" },
    { label: "🌶 pepe nero", value: "pepe nero" },
    { label: "🌶 peperoncino", value: "peperoncino" },
    { label: "🍋 scorza di limone", value: "scorza di limone" },
    { label: "🌰 noce moscata", value: "noce moscata" },
  ],

  "🍎 Frutta": [
    { label: "🍎 mela", value: "mela" },
    { label: "🍌 banana", value: "banana" },
    { label: "🍓 fragole", value: "fragole" },
    { label: "🍋 limone", value: "limone" },
    { label: "🍊 arancia", value: "arancia" },
    { label: "🍑 pesca", value: "pesca" },
    { label: "🍒 ciliegie", value: "ciliegie" },
    { label: "🍇 uva", value: "uva" },
    { label: "🍍 ananas", value: "ananas" },
    { label: "🥭 mango", value: "mango" },
    { label: "🥝 kiwi", value: "kiwi" },
    { label: "🍉 anguria", value: "anguria" },
    { label: "🍈 melone", value: "melone" },
  ],

  "🥫 Legumi e Semi": [
    { label: "🥫 fagioli", value: "fagioli" },
    { label: "🌾 ceci", value: "ceci" },
    { label: "🌰 lenticchie", value: "lenticchie" },
    { label: "🥜 arachidi", value: "arachidi" },
    { label: "🌻 semi di girasole", value: "semi di girasole" },
    { label: "🥥 cocco grattugiato", value: "cocco grattugiato" },
    { label: "🥒 piselli", value: "piselli" },
    { label: "🌾 soia", value: "soia" },
    { label: "🌰 noci", value: "noci" },
    { label: "🥜 mandorle", value: "mandorle" },
    { label: "🌰 nocciole", value: "nocciole" },
    { label: "🌰 semi di chia", value: "semi di chia" },
  ],

  "🧂 Condimenti e Oli": [
    { label: "🍶 olio d'oliva", value: "olio d'oliva" },
    { label: "🧈 burro", value: "burro" },
    { label: "🧂 sale", value: "sale" },
    { label: "🌶 pepe", value: "pepe" },
    { label: "🍋 succo di limone", value: "succo di limone" },
    { label: "🥄 aceto balsamico", value: "aceto balsamico" },
    { label: "🍯 miele", value: "miele" },
    { label: "🥛 panna", value: "panna" },
    { label: "🧀 parmigiano", value: "parmigiano" },
    { label: "🥫 passata di pomodoro", value: "passata di pomodoro" },
  ],
};

// 🔁 Aggiorna il searchTerm globale ogni volta che cambia la selezione

  useEffect(() => {
    setSearchTerm(selectedIngredients.join(", "));
  }, [selectedIngredients, setSearchTerm]);

  // ===============================
  // SELEZIONA INGREDIENTE
  // ===============================
  const toggleIngredient = (value) => {
    setSelectedIngredients((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // ===============================
  // CERCA RICETTE
  // ===============================
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setError("");
    setRecipes([]);

    try {
      const data = await apiFetch(
        `/recipes/search?ingredients=${encodeURIComponent(searchTerm)}`
      );
      const results = data.results || [];

      const translatedResults = await Promise.all(
        results.map(async (r) => ({
          ...r,
          title: await translateText(r.title),
        }))
      );

      setRecipes(translatedResults);
    } catch {
      setError("Impossibile recuperare le ricette da Spoonacular 😞");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.trim()) handleSearch();
  }, [searchTerm, handleSearch]);

  // ================================
  //         RENDER PAGE
  // ================================
  return (
    <div className="container py-5">

      {/* 🎠 CAROSELLO RICETTE IN EVIDENZA */}
      <div id="featuredCarousel" className="carousel slide mb-5 shadow" data-bs-ride="carousel">
        <div className="carousel-inner">

          {featured.length === 0 ? (
            <div className="carousel-item active text-center p-5">
              <h4>Nessuna ricetta in evidenza</h4>
            </div>
          ) : (
            featured.map((recipe, index) => (
              <div key={recipe.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <Link to={`/recipe/${recipe.id}`}>
                  <img
                    src={recipe.image || "/fallback.jpg"}
                    className="d-block w-100"
                    alt={recipe.title}
                    style={{
                      height: "380px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />

                  <div
                    className="carousel-caption d-none d-md-block"
                    style={{
                      background: "rgba(0,0,0,0.55)",
                      borderRadius: "10px",
                      padding: "10px 20px",
                    }}
                  >
                    <h5 className="fw-bold">{recipe.title}</h5>
                    <p>⏱ {recipe.readyInMinutes || "--"} min — 🍽 {recipe.servings || "--"} porzioni</p>
                  </div>
                </Link>
              </div>
            ))
          )}

        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#featuredCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#featuredCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Titolo ingredienti */}
      <h2 className="text-center pt-4 mb-4">Scegli gli ingredienti 🍽️</h2>
      <h6 className="text-center text-muted mb-3">
        Clicca sugli ingredienti o scrivili nella barra di ricerca in alto
      </h6>

      {/* Bottoni ingredienti */}
      {Object.entries(ingredientCategories).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h4 className="text-success mb-3">{category}</h4>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {items.map(({ label, value }) => (
              <button
                key={value}
                className={`btn ${
                  selectedIngredients.includes(value)
                    ? "btn-success"
                    : "btn-outline-success"
                } rounded-pill px-3`}
                onClick={() => toggleIngredient(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Pulsante Cerca */}
      <div className="text-center mt-4">
        <button
          className="btn btn-success btn-lg px-5"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Caricamento..." : "🔎 Cerca ricette"}
        </button>
      </div>

      {/* Errori */}
      {error && <p className="text-center text-danger mt-3">{error}</p>}

      {/* Risultati */}
      <div id="results-section" className="row mt-5">
        {recipes.map((r) => (
          <div key={r.id} className="col-6 col-md-3 mb-4">
            <Link to={`/recipe/${r.id}`} className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={r.image}
                  className="card-img-top"
                  alt={r.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title fw-bold">{r.title}</h6>
                  <p className="card-text text-muted small mb-0">
                    🧂 Usati: {r.usedIngredientCount} — ❌ Mancanti: {r.missedIngredientCount}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Nessun risultato */}
      {hasSearched && recipes.length === 0 && !loading && !error && (
        <p className="text-center text-muted mt-4">Nessuna ricetta trovata 😢</p>
      )}
    </div>
  );
}

export default HomePage;

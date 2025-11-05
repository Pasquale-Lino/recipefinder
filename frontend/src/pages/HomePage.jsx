import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSearch } from "../context/SearchContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";


 // 🏠 HomePage - Seleziona ingredienti per la ricerca
 
function HomePage() {
  const { searchTerm, setSearchTerm } = useSearch();
 // testo mostrato nella barra di ricerca
  const [selectedIngredients, setSelectedIngredients] = useState([]); // lista ingredienti selezionati
  const navigate = useNavigate();

  // Categorie con emoji 🍳
const ingredientCategories = {
  "🥩 Proteine": [
    { label: "🐓 pollo", value: "pollo" },
    { label: "🐄 manzo", value: "manzo" },
    { label: "🥚 uova", value: "uova" },
    { label: "🐟 pesce", value: "pesce" },
    { label: "🐖 maiale", value: "maiale" },
    { label: "🍗 tacchino", value: "tacchino" },
    { label: "🧀 formaggio", value: "formaggio" },
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
    { label: "🍛 risotto", value: "risotto" },
    { label: "🥔 gnocchi", value: "gnocchi" },
    { label: "🍕 pizza", value: "pizza" },
  ],

  "🧁 Dolci e Dessert": [
    { label: "🍫 cioccolato", value: "cioccolato" },
    { label: "🍮 zucchero", value: "zucchero" },
    { label: "🍰 panna", value: "panna" },
    { label: "🍦 gelato", value: "gelato" },
    { label: "🥛 latte", value: "latte" },
    { label: "🧈 burro", value: "burro" },
    { label: "🍯 miele", value: "miele" },
    { label: "🍪 biscotti", value: "biscotti" },
    { label: "🥧 crostata", value: "crostata" },
    { label: "🍰 torta", value: "torta" },
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



  /** 🧂 Seleziona o deseleziona un ingrediente */
  const toggleIngredient = (value) => {
  setSelectedIngredients((prev) => {
    const exists = prev.includes(value);
    const updated = exists
      ? prev.filter((v) => v !== value)
      : [...prev, value];

    // ✅ aggiorna la barra di ricerca nella Navbar (stato globale)
    setSearchTerm(updated.join(", "));

    return updated;
  });
};
  /** 🔍 Avvia ricerca */
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?ingredients=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="container py-5">
        <h1 className="text-center mb-4">Scegli gli ingredienti 🍽️</h1>
        <h6 className="text-center text-muted mb-5">
          Inserisci i tuoi ingredienti sulla barra di ricerca o clicca sugli ingredienti
          sottostanti per trovarne le ricette!
        </h6>

      {Object.entries(ingredientCategories).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h4 className="text-success mb-3">{category}</h4>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {items.map(({ label, value }) => {
              const isSelected = selectedIngredients.includes(value);
              return (
                <button
                  key={value}
                  className={`btn ${isSelected ? "btn-success" : "btn-outline-success"} rounded-pill px-3`}
                  onClick={() => toggleIngredient(value)}
                  title={value}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-5">
        <button className="btn btn-success btn-lg" onClick={handleSearch}>
          🔎 Cerca ricette
        </button>
      </div>
    </div>
  );
}

export default HomePage;

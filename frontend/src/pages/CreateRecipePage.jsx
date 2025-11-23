// src/pages/CreateRecipePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function CreateRecipePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("ingredients", form.ingredients);
    data.append("instructions", form.instructions);
    if (form.image) data.append("image", form.image);

    const res = await fetch("http://localhost:8080/api/recipes/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!res.ok) {
      alert("Errore durante la creazione della ricetta");
      setLoading(false);
      return;
    }

    alert("Ricetta creata con successo!");
    navigate("/profile");
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">➕ Crea una nuova ricetta</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Titolo</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ingredienti</label>
          <textarea
            className="form-control"
            name="ingredients"
            rows="3"
            value={form.ingredients}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Istruzioni</label>
          <textarea
            className="form-control"
            name="instructions"
            rows="4"
            value={form.instructions}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
  <label className="form-label fw-bold">Carica immagine</label>

  <input
    type="file"
    accept="image/*"
    className="form-control border border-primary"
    onChange={handleFile}
  />

  {form.image && (
    <div className="mt-3">
      <p className="text-success fw-bold">Immagine selezionata:</p>
      <img
        src={URL.createObjectURL(form.image)}
        alt="preview"
        className="img-fluid rounded"
        style={{ maxHeight: "200px", objectFit: "cover" }}
      />
    </div>
  )}
</div>


        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "⏳ Caricamento..." : "💾 Salva ricetta"}
        </button>
      </form>
    </div>
  );
}

export default CreateRecipePage;

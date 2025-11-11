// src/pages/CreateRecipePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateRecipePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes") || "[]");
    myRecipes.push(form);
    localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
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

        <button type="submit" className="btn btn-success">
          💾 Salva ricetta
        </button>
      </form>
    </div>
  );
}

export default CreateRecipePage;

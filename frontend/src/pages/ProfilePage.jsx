import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";

function ProfilePage() {
  useEffect(() => {
    document.title = "Le mie ricette - Recipe Finder";
  }, []);

  const { user, logout } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // BACKGROUND IMMAGINE PROFILO
  const bgImage =
    "https://res.cloudinary.com/dkitqea8c/image/upload/v1764264479/disposizione-degli-alimenti-conservati-sugli-scaffali_Grande_kplkle.jpg";

  // ====================== STATI MODIFICA PROFILO ======================
  const [editData, setEditData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    profileImage: user.profileImage || "",
    newAvatarFile: null,
  });

  const [previewImage, setPreviewImage] = useState(
    user.profileImage || "https://via.placeholder.com/150"
  );
  const [uploading, setUploading] = useState(false);

  // ====================== CARICA DATI PROFILO ======================
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const recipes = await apiFetch("/recipes/me");
        setMyRecipes(recipes);

        if (user.id) {
          const fav = await apiFetch(`/favorites/${user.id}`);
          setFavorites(fav);
        }
      } catch (error) {
        console.error("Errore caricamento profilo:", error);
      }
    };

    loadData();
  }, [user]);

  // ====================== ELIMINA RICETTA ======================
  const deleteRecipe = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questa ricetta?")) return;

    try {
      await apiFetch(`/recipes/admin/${id}`, { method: "DELETE" });
      setMyRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Errore eliminazione ricetta:", err);
      alert("Errore nell'eliminazione.");
    }
  };

  // ====================== TOGGLE FEATURED ======================
  const toggleFeatured = async (id) => {
    try {
      const updated = await apiFetch(`/recipes/admin/${id}/featured`, {
        method: "PUT",
      });

      setMyRecipes((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      console.error("Errore toggle featured:", err);
    }
  };

  // ====================== TOGGLE PUBLIC/PRIVATE ======================
  const togglePublic = async (id) => {
    try {
      const updated = await apiFetch(`/recipes/admin/${id}/public`, {
        method: "PUT",
      });

      setMyRecipes((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      console.error("Errore toggle public:", err);
    }
  };

  // ====================== UPDATE PROFILO (Cloudinary + Backend) ======================
  const saveProfileChanges = async () => {
    try {
      let imageUrl = editData.profileImage;

      // Se è stata caricata una nuova immagine
      if (editData.newAvatarFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", editData.newAvatarFile);
        formData.append("upload_preset", "ml_default"); // preset Cloudinary

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dkitqea8c/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await uploadRes.json();
        imageUrl = data.secure_url;
        setUploading(false);
      }

      // Salvo sul backend
      const updatedUser = await apiFetch(`/users/update-profile`, {
        method: "PUT",
        body: JSON.stringify({
          firstName: editData.firstName,
          lastName: editData.lastName,
          phoneNumber: editData.phoneNumber,
          profileImage: imageUrl,
        }),
      });

      // Aggiorno localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.location.reload();

    } catch (err) {
      console.error("Errore aggiornamento profilo:", err);
      alert("Errore durante l'aggiornamento del profilo");
      setUploading(false);
    }
  };

  // ====================== SE NON LOGGATO ======================
  if (!user) {
    return (
      <div className="text-center py-5">
        <h2>Effettua il login per accedere al tuo profilo 🔐</h2>
        <button
          className="btn btn-warning mt-3"
          data-bs-toggle="modal"
          data-bs-target="#loginModal"
        >
          🔑 Login
        </button>
      </div>
    );
  }

  // ====================== UI PROFILO ======================
  return (
    <div
      className="customProfile"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
          url(${bgImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div className="container py-5">

        {/* HEADER PROFILO */}
        <div className="d-flex justify-content-between align-items-center mb-4 w-100 flex-wrap" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}>

  {/* CARD PROFILO UTENTE */}
  <div className="d-flex align-items-center gap-3 p-3 rounded shadow"
       >

    {/* FOTO PROFILO */}
    <img
      src={user.profileImage || "https://via.placeholder.com/120"}
      alt="avatar"
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid white",
      }}
    />

    {/* INFO UTENTE */}
    <div>
      <h2 className="text-outline m-0">
        👋 Benvenuto,{" "}
        {user.firstName
          ? `${user.firstName} ${user.lastName || ""}`
          : user.username || user.email}
      </h2>

      <p className="text-light m-0 mt-1">
        📧 Email: <strong>{user.email}</strong>
      </p>

      {user.phoneNumber && (
        <p className="text-light m-0">
          📞 Telefono: <strong>{user.phoneNumber}</strong>
        </p>
      )}
    </div>
  </div>

  {/* BOTTONI AZIONE */}
  <div className="d-flex gap-2 mx-3 mod-prof">
    <button
      className="btn btn-outline-warning"
      data-bs-toggle="modal"
      data-bs-target="#editProfileModal"
    >
      ✏️ Modifica
    </button>

    <button className="btn btn-outline-danger" onClick={logout}>
      🚪 Esci
    </button>
  </div>
</div>


        {/* ======================= */}
        {/*    LE MIE RICETTE       */}
        {/* ======================= */}
        <div className="mb-5">
          <h4 className="text-outline">📒 Le mie ricette</h4>

          <div className="row g-4 mt-3">
            {myRecipes.length === 0 ? (
              <p className="text-muted">Nessuna ricetta creata finora.</p>
            ) : (
              myRecipes.map((r) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-3 d-flex"
                  key={r.id}
                >
                  <div className="card shadow-sm w-100 h-100">
                    <img
                      src={
                        r.image ||
                        "https://via.placeholder.com/600x400?text=Nessuna+immagine"
                      }
                      className="card-img-top"
                      alt={r.title}
                      style={{ height: "220px", objectFit: "cover" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{r.title}</h5>

                      <div className="mt-3 d-flex flex-wrap gap-2 justify-content-between">
                        <Link
                          to={`/recipe/${r.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          👁️ Vedi
                        </Link>

                        <Link
                          to={`/edit-recipe/${r.id}`}
                          className="btn btn-warning btn-sm"
                        >
                          ✏️ Modifica
                        </Link>

                        <button
                          className={`btn btn-sm ${
                            r.featured
                              ? "btn-warning"
                              : "btn-outline-warning"
                          }`}
                          onClick={() => toggleFeatured(r.id)}
                        >
                          ⭐ {r.featured ? "In Homepage" : "Featured"}
                        </button>

                        <button
                          className={`btn btn-sm ${
                            r.publicRecipe
                              ? "btn-success"
                              : "btn-outline-secondary"
                          }`}
                          onClick={() => togglePublic(r.id)}
                        >
                          🌍 {r.publicRecipe ? "Pubblica" : "Privata"}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteRecipe(r.id)}
                        >
                          🗑️ Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            to="/create-recipe"
            className="btn btn-success mt-3 text-outline"
          >
            ➕ Crea una nuova ricetta
          </Link>
        </div>

        {/* ======================= */}
        {/*     PREFERITI           */}
        {/* ======================= */}
        <div className="mb-5">
          <h4 className="text-outline">❤️ Ricette preferite</h4>

          {favorites.length === 0 ? (
            <p className="text-muted text-outline">
              Non hai ancora salvato nessuna ricetta.
            </p>
          ) : (
            <ul className="list-group">
              {favorites.map((r) => (
                <li
                  key={r.id}
                  className="list-group-item d-flex justify-content-between align-items-center text-preferiti"
                >
                  {r.title}
                  <Link
                    to={`/recipe/${r.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    👁️ Vedi
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ======================= */}
        {/*     ADMIN PANEL         */}
        {/* ======================= */}
        {user.role === "ADMIN" && (
          <div className="border-top pt-4 text-outline">
            <h4>👑 Pannello Admin</h4>
            <p className="text-outline text-muted">
              Funzionalità di moderazione in arrivo.
            </p>
          </div>
        )}
      </div>

      {/* ======================= */}
      {/* MODALE MODIFICA PROFILO */}
      {/* ======================= */}
      <div
        className="modal fade"
        id="editProfileModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Modifica profilo</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">

              {/* PREVIEW AVATAR */}
              <div className="text-center mb-3">
                <img
                  src={previewImage}
                  alt="avatar"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
              </div>

              {/* FORM */}
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Cognome</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Telefono</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.phoneNumber}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Foto profilo</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditData({ ...editData, newAvatarFile: file });
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Annulla
              </button>

              <button
                className="btn btn-success"
                onClick={saveProfileChanges}
              >
                {uploading ? "Caricamento..." : "Salva modifiche"}
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default ProfilePage;

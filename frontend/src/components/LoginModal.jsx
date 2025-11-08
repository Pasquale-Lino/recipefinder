// src/components/LoginModal.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function LoginModal() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email);
    window.location.href = "/profile";
  };

  return (
    <div className="modal fade" id="loginModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-light">
          <div className="modal-header">
            <h5 className="modal-title text-warning">Accedi 🔐</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <input type="email" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="btn btn-warning w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;

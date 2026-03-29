import { useState } from "react";

export default function AdminLogin({ onLogin, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Hardcoded admin credentials
    if (username === "santhosh" && password === "santhosh 123") {
      onLogin();
      setError("");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="glass-card" style={{ width: "100%", maxWidth: "400px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Admin Login</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "var(--danger-color)", fontSize: "0.9rem", margin: "0" }}>{error}</p>}

        <div className="flex-row" style={{ marginTop: "10px" }}>
          <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

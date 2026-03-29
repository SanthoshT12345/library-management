import { useState } from "react";
import { addBorrower } from "../services/borrowerService";

export default function AddBorrower({ onBorrowerAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await addBorrower(formData);
      setFormData({ name: "", email: "", phone: "" });
      setSuccess("Borrower added successfully!");
      if (onBorrowerAdded) {
        onBorrowerAdded();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add borrower");
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>👤</span> Add Borrower
      </h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          className="input-field"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="input-field"
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="input-field"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-secondary" style={{ marginTop: "8px" }}>Add Borrower</button>
        {error && <span style={{ color: "var(--danger-color)", fontSize: "0.9rem" }}>{error}</span>}
        {success && <span style={{ color: "var(--secondary-color)", fontSize: "0.9rem" }}>{success}</span>}
      </form>
    </div>
  );
}

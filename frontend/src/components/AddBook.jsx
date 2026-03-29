import { useState } from "react";
import { addBook } from "../services/bookService";

export default function AddBook({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    publishedYear: "",
    availableCopies: ""
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
      await addBook({
        ...formData,
        publishedYear: Number(formData.publishedYear),
        availableCopies: Number(formData.availableCopies)
      });

      setFormData({
        title: "",
        author: "",
        category: "",
        publishedYear: "",
        availableCopies: ""
      });

      setSuccess("Book added successfully!");
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError("Failed to add book");
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>➕</span> Add New Book
      </h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input className="input-field" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input className="input-field" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
        <input className="input-field" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        
        <div className="flex-row">
          <input className="input-field" name="publishedYear" type="number" placeholder="Year" value={formData.publishedYear} onChange={handleChange} required />
          <input className="input-field" name="availableCopies" type="number" placeholder="Copies" value={formData.availableCopies} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>Add Book</button>
        {error && <p style={{ color: "var(--danger-color)", margin: "0", fontSize: "0.9rem" }}>{error}</p>}
        {success && <p style={{ color: "var(--secondary-color)", margin: "0", fontSize: "0.9rem" }}>{success}</p>}
      </form>
    </div>
  );
}

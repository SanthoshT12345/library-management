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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      onBookAdded(); // refresh book list
    } catch (err) {
      alert("Failed to add book");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px",display:"flex",gap:"3px",alignItems:"center"}}>
      <h3>Add New Book :</h3>

      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <br />

      <input name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
      <br />

      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <br />

      <input name="publishedYear" type="number" placeholder="Published Year" value={formData.publishedYear} onChange={handleChange} required />
      <br />

      <input name="availableCopies" type="number" placeholder="Available Copies" value={formData.availableCopies} onChange={handleChange} required />
      <br /><br />

      <button type="submit">Add Book</button>
    </form>
  );
}

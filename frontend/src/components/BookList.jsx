import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import AddBook from "./AddBook";

import {
  getAllBooks,
  updateCopies,
  deleteBook,
  updateBookDetails
} from "../services/bookService";

export default function BookList({ isAdmin }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [after2015Only, setAfter2015Only] = useState(false);

  const loadBooks = async () => {
    const data = await getAllBooks();
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleUpdate = async (id, change) => {
    try {
      await updateCopies(id, change);
      loadBooks();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      loadBooks();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    }
  };

  const handleEditDetails = async (book) => {
    const newTitle = prompt("Edit title:", book.title);
    if (!newTitle) return;
    const newAuthor = prompt("Edit author:", book.author);
  if (!newAuthor) return;

    const newCategory = prompt("Edit category:", book.category);
    if (!newCategory) return;

    const newYear = prompt("Edit published year:", book.publishedYear);
    if (!newYear || isNaN(newYear)) return;

    try {
      await updateBookDetails(book._id, {
        title: newTitle,
        author: newAuthor, 
        category: newCategory,
        publishedYear: Number(newYear)
      });
      loadBooks();
      setError("");
    } catch {
      setError("Book details update failed");
    }
  };

  const searchedBooks = books
    .filter(book => (isAdmin ? true : book.availableCopies > 0))
    .filter(book => (after2015Only ? book.publishedYear > 2015 : true))
    .filter(book => {
      const term = searchTerm.toLowerCase();
      return (
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.category.toLowerCase().includes(term)
      );
    });

  return (
    <div style={{ maxWidth: "1200px", margin: "auto" }}>
      <input
        type="text"
        placeholder="Search by title, author, or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      />

      <label style={{ display: "block", marginBottom: "10px" }}>
        <input
          type="checkbox"
          checked={after2015Only}
          onChange={(e) => setAfter2015Only(e.target.checked)}
        />{" "}
        Show books published after 2015
      </label>

      <Dashboard books={books} />

      {isAdmin && <AddBook onBookAdded={loadBooks} />}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📚 FLEX CONTAINER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          
        }}
      >
        {searchedBooks.map(book => (
          <div
            key={book._id}
            style={{
              width: "100%",
              maxWidth: "320px",
              border: "1px solid #ccc",
              padding: "12px",
              borderRadius: "8px",
              background: "linear-gradient(brown,#CD5646FF)",
              color: "white"
            }}
          >
            <center> {isAdmin && (
              <button
                onClick={() => handleEditDetails(book)}
                style={{ marginBottom: "10px" }}
              >
                ✏️ Edit Details
              </button>
            )}</center>
           

            <p><b>Title:</b> {book.title}</p>
            <p><b>Author:</b> {book.author}</p>
            <p><b>Category:</b> {book.category}</p>
            <p><b>Year:</b> {book.publishedYear}</p>
            <p><b>Copies:</b> {book.availableCopies}</p>

            {isAdmin && (
              <>
                <button onClick={() => handleUpdate(book._id, +1)}>➕</button>
                <button
                  onClick={() => handleUpdate(book._id, -1)}
                  style={{ marginLeft: "6px" }}
                >
                  ➖
                </button>

                <button
                  onClick={() => handleDelete(book._id)}
                  disabled={book.availableCopies !== 0}
                  style={{
                    marginLeft: "8px",
                    backgroundColor:
                      book.availableCopies === 0 ? "red" : "gray",
                    color: "white"
                  }}
                >
                  ❌ Delete
                </button>
              </>
            )}

            <p style={{ color: isAdmin ? "lightgreen" : "lightblue" }}>
              Role: {isAdmin ? "Admin" : "User"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

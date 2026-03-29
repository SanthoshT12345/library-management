
import { getBorrowers } from "../services/borrowerService";
import { borrowBook, returnBook } from "../services/borrowService";
import BorrowDashboard from "./BorrowDashboard";

import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import AddBook from "./AddBook";
import AddBorrower from "./AddBorrower";
import BorrowerList from "./BorrowerList";

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
  const [borrowers, setBorrowers] = useState([]);
  const [showBorrowDashboard, setShowBorrowDashboard] = useState(false);
  const [showBorrowers, setShowBorrowers] = useState(false);

  const loadBorrowers = async () => {
    const data = await getBorrowers();
    setBorrowers(data);
  };

  const loadBooks = async () => {
    const data = await getAllBooks();
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
    loadBorrowers();
  }, []);

  const handleReturn = async () => {
    const borrowId = prompt("Enter Borrow ID to return book:");
    if (!borrowId) return;

    try {
      console.log("Returning borrow ID:", borrowId);
      const res = await returnBook(borrowId);
      console.log("Return response:", res);
      loadBooks();
      alert("Book returned successfully");
    } catch (err) {
      console.error("Frontend return error:", err.response?.data || err.message);
      alert("Return failed. Check console.");
    }
  };

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

  const handleBorrow = async (bookId) => {
    if (borrowers.length === 0) {
      alert("No borrowers found. Add borrower first.");
      return;
    }

    const email = prompt("Enter Borrower Email (e.g., cs23192@velammalitech.edu.in):");
    if (!email) return;

    const normalizedEmail = email.trim().toLowerCase();
    const borrower = borrowers.find(b => b.email.toLowerCase() === normalizedEmail);
    
    if (!borrower) {
      alert(`Borrower with email "${email}" not found in the Library Borrowers list. Please check for typos or add them first.`);
      return;
    }

    try {
      await borrowBook({
        bookId,
        studentId: borrower._id,
        email: borrower.email
      });
      loadBooks();
      alert("Book borrowed successfully!");
    } catch (err) {
      console.error("Borrow Error:", err);
      alert("Borrow failed: " + (err.response?.data?.error || err.message));
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
    <div style={{ width: "100%" }}>
      
      {/* Search & Filter Top Bar */}
      <div className="glass-card" style={{ marginBottom: "24px" }}>
        <input
          type="text"
          className="input-field"
          placeholder="🔍 Search by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "15px" }}
        />

        <label className="flex-row" style={{ cursor: "pointer", userSelect: "none" }}>
          <input
             type="checkbox"
             checked={after2015Only}
             onChange={(e) => setAfter2015Only(e.target.checked)}
             style={{ width: "18px", height: "18px", accentColor: "var(--primary-color)" }}
          />
          <span style={{ fontSize: "1rem" }}>Show books published after 2015</span>
        </label>
      </div>

      {isAdmin && showBorrowDashboard && (
        <div style={{ marginBottom: "24px" }}>
          <BorrowDashboard />
        </div>
      )}

      <Dashboard books={books} />

      {isAdmin && (
        <div className="flex-wrap" style={{ marginBottom: "24px" }}>
          <button
             onClick={() => setShowBorrowDashboard(!showBorrowDashboard)}
             className="btn-outline"
          >
             📊 Borrow Dashboard
          </button>
          
          <button
             onClick={() => setShowBorrowers(!showBorrowers)}
             className="btn-outline"
          >
             👥 View Borrowers
          </button>
        </div>
      )}

      {isAdmin && showBorrowers && (
        <div style={{ marginBottom: "24px" }}>
          <BorrowerList borrowers={borrowers} />
        </div>
      )}

      {isAdmin && (
        <div className="glass-card" style={{ marginBottom: "30px" }}>
          <div className="flex-wrap" style={{ gap: "40px" }}>
            <div style={{ flex: "1 1 min-content" }}>
              <AddBook onBookAdded={loadBooks} />
            </div>
            <div style={{ width: "1px", background: "var(--surface-border)" }} className="divider"></div>
            <div style={{ flex: "1 1 min-content" }}>
              <AddBorrower onBorrowerAdded={loadBorrowers} />
            </div>
          </div>
        </div>
      )}

      {error && <p style={{ color: "var(--danger-color)", padding: "10px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>{error}</p>}

      {/* 📚 BOOK GRID */}
      <div className="dashboard-grid">
        {searchedBooks.map(book => (
          <div key={book._id} className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
            
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ marginBottom: "12px", fontSize: "1.2rem", color: "var(--primary-color)" }}>{book.title}</h3>
              <p style={{ margin: "6px 0", fontSize: "0.95rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Author:</span> {book.author}
              </p>
              <p style={{ margin: "6px 0", fontSize: "0.95rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Category:</span> <span className="badge" style={{ background: "rgba(255,255,255,0.1)" }}>{book.category}</span>
              </p>
              <p style={{ margin: "6px 0", fontSize: "0.95rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Year:</span> {book.publishedYear}
              </p>
              <p style={{ margin: "6px 0", fontSize: "0.95rem", fontWeight: "600", color: book.availableCopies > 0 ? "var(--secondary-color)" : "var(--danger-color)" }}>
                Copies: {book.availableCopies}
              </p>
            </div>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {isAdmin && (
                <>
                  <div className="flex-between">
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Stock Mgmt:</span>
                    <div className="flex-row" style={{ gap: "6px" }}>
                      <button className="btn-outline" style={{ padding: "4px 8px" }} onClick={() => handleUpdate(book._id, -1)} disabled={book.availableCopies === 0}>➖</button>
                      <button className="btn-outline" style={{ padding: "4px 8px" }} onClick={() => handleUpdate(book._id, 1)}>➕</button>
                    </div>
                  </div>
                  
                  <div className="flex-row" style={{ flexWrap: "wrap", marginTop: "10px" }}>
                    <button className="btn-outline" style={{ flex: 1, fontSize: "0.85rem", padding: "6px" }} onClick={() => handleEditDetails(book)}>
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-danger" 
                      style={{ flex: 1, fontSize: "0.85rem", padding: "6px" }} 
                      disabled={book.availableCopies !== 0} 
                      onClick={() => handleDelete(book._id)}
                    >
                      ❌ Delete
                    </button>
                  </div>
                </>
              )}

              {isAdmin && book.availableCopies > 0 && (
                <button className="btn-secondary" style={{ width: "100%" }} onClick={() => handleBorrow(book._id)}>
                  📚 Borrow
                </button>
              )}
              {isAdmin && (
                <button className="btn-primary" style={{ width: "100%" }} onClick={handleReturn}>
                  🔁 Return
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
      
      {searchedBooks.length === 0 && (
        <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
           <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No books found matching your criteria.</p>
        </div>
      )}
      
    </div>
  );
}

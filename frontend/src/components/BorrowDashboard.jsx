import { useEffect, useState } from "react";
import { getActiveBorrows, returnBook } from "../services/borrowService";

export default function BorrowDashboard() {
  const [borrows, setBorrows] = useState([]);
  const [error, setError] = useState("");

  const loadBorrows = async () => {
    try {
      const data = await getActiveBorrows(); // fetch active borrows instead of borrowers
      setBorrows(data);
    } catch (err) {
      setError("Failed to load borrowed books");
    }
  };

  useEffect(() => {
    loadBorrows();
  }, []);

  const handleReturn = async (borrowId) => {
    if (!window.confirm("Return this book?")) return;

    try {
      await returnBook(borrowId);
      loadBorrows();
    } catch (err) {
      alert("Return failed");
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
        📊 <span>Borrowed Books Dashboard</span>
      </h2>

      {error && <p style={{ color: "var(--danger-color)", padding: "10px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>{error}</p>}

      {borrows.length === 0 && (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>No active borrowed books.</p>
      )}

      <div className="dashboard-grid">
        {borrows.map((b) => (
          <div key={b._id} className="glass-card" style={{ background: "rgba(0,0,0,0.2)" }}>
            <p style={{ margin: "4px 0", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--text-muted)" }}>ID:</span> {b._id.slice(-6)}
            </p>
            <h3 style={{ margin: "8px 0", fontSize: "1.1rem", color: "var(--primary-color)" }}>
              {b.bookId?.title || "Unknown Book"}
            </h3>
            <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Student:</span> {b.studentEmail}
            </p>
            <p style={{ margin: "4px 0", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Borrowed:</span> {new Date(b.borrowDate).toLocaleDateString()}
            </p>
            <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "var(--danger-color)" }}>
              <span style={{ color: "var(--text-muted)" }}>Due:</span> {new Date(b.dueDate).toLocaleDateString()}
            </p>

            <button
              onClick={() => handleReturn(b._id)}
              className="btn-primary"
              style={{ width: "100%", marginTop: "16px" }}
            >
              🔁 Return Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

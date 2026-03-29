import { useEffect, useState } from "react";
import { getActiveBorrows, returnBook } from "../services/borrowService";

export default function BorrowedList({ onReturned }) {
  const [borrows, setBorrows] = useState([]);

  const loadBorrows = async () => {
    const data = await getActiveBorrows();
    setBorrows(data);
  };

  useEffect(() => {
    loadBorrows();
  }, []);

  const handleReturn = async (borrowId) => {
    if (!window.confirm("Return this book?")) return;

    await returnBook(borrowId);
    await loadBorrows();
    onReturned(); // refresh books
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📕 Borrowed Books</h3>

      {borrows.length === 0 && <p>No active borrows</p>}

      {borrows.map(b => (
        <div
          key={b._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "8px",
            borderRadius: "6px"
          }}
        >
          <p><b>Book:</b> {b.bookId.title}</p>
          <p><b>Student:</b> {b.borrowerId.studentId}</p>
          <p><b>Due:</b> {new Date(b.dueDate).toDateString()}</p>

          <button
            onClick={() => handleReturn(b._id)}
            style={{ backgroundColor: "green", color: "white" }}
          >
            🔁 Return
          </button>
        </div>
      ))}
    </div>
  );
}

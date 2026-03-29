import { useState } from "react";
import { borrowBook } from "../services/borrowService";

export default function BorrowForm({ bookId, onSuccess }) {
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidStudentId = (id) => {
    const num = Number(id.replace("CSD122", ""));
    return id.startsWith("CSD122") && num >= 1001 && num <= 1060;
  };

  const handleBorrow = async () => {
    if (!isValidStudentId(studentId)) {
      alert("Student ID must be between CSD1221001 and CSD1221060");
      return;
    }

    const email = `${studentId.toLowerCase()}@gmail.com`;

    try {
      setLoading(true);
      await borrowBook({
        bookId,
        studentId,
        email
      });

      alert("Book borrowed successfully ✅");
      setStudentId("");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Borrow failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "10px",
        border: "1px solid #eee",
        borderRadius: "6px",
        background: "#222"
      }}
    >
      <input
        type="text"
        placeholder="Student ID (CSD1221001)"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value.toUpperCase())}
        style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
      />

      <button
        onClick={handleBorrow}
        disabled={loading}
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "#27ae60",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Borrowing..." : "📘 Borrow Book"}
      </button>
    </div>
  );
}

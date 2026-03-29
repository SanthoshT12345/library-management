const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const { sendBorrowEmail } = require("../utils/emailService");

// Get all borrow records (history)
exports.getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("bookId", "title author category")
      .sort({ createdAt: -1 });

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch borrow records" });
  }
};

// Get only active borrows for the dashboard
exports.getActiveBorrows = async (req, res) => {
  try {
    // Exclude returned books
    const borrows = await Borrow.find({ status: { $ne: "returned" } })
      .populate("bookId", "title");

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active borrows" });
  }
};

// Borrow book
exports.borrowBook = async (req, res) => {
  try {
    const { bookId, studentId, email } = req.body;

    if (!bookId || !studentId || !email) {
      return res.status(400).json({ error: "Missing borrow details" });
    }

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ error: "Book not available" });
    }

    // prevent same student borrowing same book twice actively
    const alreadyBorrowed = await Borrow.findOne({
      bookId,
      studentId,
      status: { $in: ["issued", "overdue"] }
    });

    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({ error: "Student already has an active borrow for this book" });
    }

    // reduce copies
    book.availableCopies -= 1;
    await book.save();

    // set due date (7 days)
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7);

    const borrow = new Borrow({
      bookId,
      studentId,
      studentEmail: email,
      borrowDate,
      dueDate,
      status: "issued"
    });

    await borrow.save();

    // Trigger async email independently (fire-and-forget to avoid slow responses)
    sendBorrowEmail(email, book.title, borrowDate, dueDate).catch(err => console.error("Email send failed:", err));

    res.status(201).json(borrow);
  } catch (err) {
    console.error("BORROW ERROR:", err.message);
    res.status(500).json({ error: "Borrow failed" });
  }
};

// Return book
exports.returnBook = async (req, res) => {
  try {
    const borrowId = req.params.id;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    if (borrow.status === "returned") {
      return res.status(400).json({ error: "Book is already returned" });
    }

    const book = await Book.findById(borrow.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Increase book copies
    book.availableCopies += 1;
    await book.save();

    // Soft-delete the record by changing status instead of findByIdAndDelete
    borrow.status = "returned";
    borrow.actualReturnDate = new Date();
    // Fine should ideally be paid at return, but we retain whatever is computed till that day
    await borrow.save();

    res.json({ message: "Book returned successfully", borrow });
  } catch (error) {
    console.error("RETURN ERROR:", error.message);
    res.status(500).json({ error: "Failed to return book" });
  }
};

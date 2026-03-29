const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");

exports.issueBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // 1. Prevent issuing if user has unpaid fines
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.fine > 0) return res.status(400).json({ error: "Cannot borrow book with unpaid fines" });

    // 2. Max 3 books logic
    const activeIssues = await Issue.countDocuments({ userId, status: { $in: ["issued", "overdue"] } });
    if (activeIssues >= 3) return res.status(400).json({ error: "Maximum borrowing limit (3) reached" });

    // 3. Prevent borrowing same book twice without returning
    const alreadyIssued = await Issue.findOne({ userId, bookId, status: { $in: ["issued", "overdue"] } });
    if (alreadyIssued) return res.status(400).json({ error: "You have already borrowed this book and not returned it" });

    // 4. Race Condition Prevention & Check available copies
    const book = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true }
    );
    if (!book) return res.status(400).json({ error: "Book is not available" });

    // 5. Create issue record
    const issue = await Issue.create({ userId, bookId });
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params; // Issue ID

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ error: "Issue record not found" });
    if (issue.status === "returned") return res.status(400).json({ error: "Book is already returned" });

    // 1. Update issue state
    const actualReturnDate = new Date();
    issue.actualReturnDate = actualReturnDate;

    // Calculate fine if late
    if (actualReturnDate > issue.returnDate) {
      const diffTime = Math.abs(actualReturnDate - issue.returnDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      issue.fine = diffDays * 10;
      
      // Add fine to user
      await User.findByIdAndUpdate(issue.userId, { $inc: { fine: issue.fine } });
    }

    issue.status = "returned";
    await issue.save();

    // 2. Increase available copies for the book
    await Book.findByIdAndUpdate(issue.bookId, { $inc: { availableCopies: 1 } });

    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listIssuedBooks = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "issued" })
      .populate("userId", "name email fine")
      .populate("bookId", "title author availableCopies");
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listOverdueBooks = async (req, res) => {
  try {
    // Transition any newly overdue items
    await Issue.updateMany(
      { status: "issued", returnDate: { $lt: new Date() } },
      { $set: { status: "overdue" } }
    );

    const overdues = await Issue.find({ status: "overdue" })
      .populate("userId", "name email fine")
      .populate("bookId", "title author availableCopies");
    res.json(overdues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

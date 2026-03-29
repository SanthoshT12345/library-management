const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    studentId: {
      type: String,
      required: true // frontend sends this
    },
    studentEmail: {
      type: String,
      required: true
    },
    borrowDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    actualReturnDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued"
    },
    fine: {
      type: Number,
      default: 0
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    lastOverdueEmailSent: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Borrow", borrowSchema);

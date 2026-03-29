const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    returnDate: {
      type: Date,
      required: true,
      default: function() {
        // 7 days from now
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      }
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  totalCopies: {
    type: Number,
    required: true,
    min: [0, "Total copies cannot be negative"],
    default: function() { return this.availableCopies; }
  },
  availableCopies: {
    type: Number,
    required: true,
    min: [0, "Copies cannot be negative"]
  }
});

module.exports = mongoose.model("Book", bookSchema);

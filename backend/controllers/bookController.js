const Book = require("../models/Book");

// CREATE
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ
exports.getAllBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

// UPDATE COPIES
exports.updateCopies = async (req, res) => {
  const { change } = req.body;

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });

  if (book.availableCopies + change < 0) {
    return res.status(400).json({ error: "Negative stock not allowed" });
  }

  book.availableCopies += change;
  await book.save();
  res.json(book);
};
exports.updateAuthor = async (req, res) => {
  const { author } = req.body;

  if (!author || author.trim() === "") {
    return res.status(400).json({ error: "Author name is required" });
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  book.author = author;
  await book.save();

  res.json(book);
};
exports.updateBookDetails = async (req, res) => {
  try {
    const { title, category, publishedYear } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (title !== undefined) book.title = title;
    if (category !== undefined) book.category = category;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// DELETE
exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });

  if (book.availableCopies !== 0) {
    return res.status(400).json({ error: "Copies still available" });
  }

  await book.deleteOne();
  res.json({ message: "Book deleted" });
};

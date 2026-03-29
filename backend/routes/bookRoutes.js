const express = require("express");
const {
  addBook,
  getAllBooks,
  updateCopies,
  updateAuthor,
  updateBookDetails,
  deleteBook
} = require("../controllers/bookController");

const router = express.Router();

router.post("/", addBook);
router.get("/", getAllBooks);
router.put("/:id/copies", updateCopies);
router.put("/:id/author", updateAuthor);
router.put("/:id", updateBookDetails);
router.delete("/:id", deleteBook);

module.exports = router;

const express = require("express");
const {
  issueBook,
  returnBook,
  listIssuedBooks,
  listOverdueBooks
} = require("../controllers/issueController");

const router = express.Router();

router.post("/", issueBook);
router.post("/return/:id", returnBook);
router.get("/issued", listIssuedBooks);
router.get("/overdue", listOverdueBooks);

module.exports = router;

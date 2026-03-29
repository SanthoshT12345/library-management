const express = require("express");
const router = express.Router();

const {
  borrowBook,
  returnBook,
  getActiveBorrows
} = require("../controllers/borrowController");

router.post("/borrow", borrowBook);
router.put("/return/:id", returnBook);
router.get("/", getActiveBorrows);

module.exports = router;

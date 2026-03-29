const express = require("express");
const {
  addBorrower,
  getBorrowers
} = require("../controllers/borrowerController");

const router = express.Router();

router.post("/", addBorrower);
router.get("/", getBorrowers);

module.exports = router;

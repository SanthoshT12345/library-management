const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookController");

router.post("/", controller.addBook);
router.get("/", controller.getAllBooks);

// ⚠️ MORE SPECIFIC ROUTES FIRST
router.put("/:id/copies", controller.updateCopies);


// ⚠️ GENERIC ROUTE LAST
router.put("/:id", controller.updateBookDetails);

router.delete("/:id", controller.deleteBook);

module.exports = router;

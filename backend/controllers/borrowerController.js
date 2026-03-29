const Borrower = require("../models/Borrower");

// Add borrower
exports.addBorrower = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const borrower = new Borrower({ name, email, phone });
    await borrower.save();

    res.status(201).json(borrower);
  } catch (error) {
    res.status(500).json({ error: "Failed to add borrower" });
  }
};

// Get all borrowers
exports.getBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find();
    res.json(borrowers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch borrowers" });
  }
};

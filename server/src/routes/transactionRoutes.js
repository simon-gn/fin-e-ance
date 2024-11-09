const express = require("express");
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Fetch transactions
router.get("/get", authMiddleware, getTransactions);

// Add transaction
router.post("/add", authMiddleware, addTransaction);

// Delete transaction
router.post("/delete", authMiddleware, deleteTransaction);

module.exports = router;

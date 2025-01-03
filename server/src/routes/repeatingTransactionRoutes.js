const express = require("express");
const {
  getRepeatingTransactions,
  addRepeatingTransaction,
  deleteRepeatingTransaction,
} = require("../controllers/repeatingTransactionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/get", authMiddleware, getRepeatingTransactions);

router.post("/add", authMiddleware, addRepeatingTransaction);

router.post("/delete", authMiddleware, deleteRepeatingTransaction);

module.exports = router;

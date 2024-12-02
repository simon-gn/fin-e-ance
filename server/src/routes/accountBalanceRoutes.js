const express = require("express");
const {
  getAccountBalances,
  setAccountBalance,
} = require("../controllers/accountBalanceController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Fetch accountBalances
router.get("/get", authMiddleware, getAccountBalances);

// Add accountBalances
router.post("/set", authMiddleware, setAccountBalance);

module.exports = router;

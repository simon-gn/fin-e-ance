const express = require("express");
const {
  getCategories,
  addCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Fetch categories
router.get("/get", authMiddleware, getCategories);

// Add category
router.post("/add", authMiddleware, addCategory);

// Delete category
router.post("/delete", authMiddleware, deleteCategory);

module.exports = router;

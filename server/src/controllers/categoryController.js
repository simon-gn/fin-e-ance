const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.addCategory = async (req, res) => {
  const { name, color } = req.body;
  const userId = req.user.id;

  try {
    const newCategory = await Category.create({ name, color, userId });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.user.id;

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

    // Revert all transactions assocciated with deleted category to 'Uncategorized'
    const defaultCategory = await Category.findOne({ name: 'Uncategorized' });
    if (!defaultCategory) {
      throw new Error('Default category not found');
    }
    await Transaction.updateMany(
      { category: categoryId },
      { category: defaultCategory._id }
    );

    await category.deleteOne();
    res.status(200).json({ message: "Category removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

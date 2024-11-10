const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = { user: req.user.id };
    if (type) {
      filter.type = type;
    }
    if (category) {
      filter.category = category;
    }
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(filter)
      .populate("category", "name color")
      .sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, description } = req.body;

    const newTransaction = await Transaction.create({
      user: req.user.id,
      type,
      category,
      amount,
      description,
    });

    const transactionPopulated = await Transaction.findById(newTransaction._id).populate("category", "name color");

    res.status(201).json(transactionPopulated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

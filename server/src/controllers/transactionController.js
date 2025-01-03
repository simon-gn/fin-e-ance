const Transaction = require("../models/Transaction");
const {
  addAccountBalance,
  deleteAccountBalance,
} = require("./accountBalanceController");

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
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(filter)
      .populate("category", "name color")
      .sort({ date: -1, createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { type, date, category, amount, description } = req.body;

    const newTransaction = await Transaction.create({
      user: req.user.id,
      type,
      date,
      category,
      amount,
      description,
    });

    const transactionPopulated = await Transaction.findById(
      newTransaction._id
    ).populate("category", "name color");

    const newAccountBalance = await addAccountBalance(
      req.user.id,
      newTransaction._id,
      type === "Expense" ? -amount : amount,
      date
    );

    res
      .status(201)
      .json({ newTransaction: transactionPopulated, newAccountBalance });
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

    await deleteAccountBalance(
      req.user.id,
      transactionId,
      transaction.type === "Expense" ? transaction.amount : -transaction.amount
    );
    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

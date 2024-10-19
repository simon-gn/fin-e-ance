const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  const { type, amount, category, description } = req.body;
  try {
    const newTransaction = new Transaction({ user: req.user.id, type, amount, category, description });
    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

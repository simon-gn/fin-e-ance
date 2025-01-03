const RepeatingTransaction = require("../models/RepeatingTransaction");

exports.getRepeatingTransactions = async (req, res) => {
  try {
    const repeatingTransactions = await RepeatingTransaction.find({
      userId: req.user.id,
    })
      .populate("category", "name color")
      .sort({ startDate: -1 });
    res.status(200).json(repeatingTransactions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching repeating repeatingTransactions",
      error,
    });
  }
};

exports.addRepeatingTransaction = async (req, res) => {
  try {
    const {
      type,
      category,
      amount,
      startDate,
      frequency,
      endDate,
      description,
    } = req.body;

    const newRepeatingTransaction = await RepeatingTransaction.create({
      userId: req.user.id,
      type,
      category,
      amount,
      startDate,
      frequency,
      endDate,
      description,
    });

    const repeatingTransactionPopulated = await RepeatingTransaction.findById(
      newRepeatingTransaction._id
    ).populate("category", "name color");

    res.status(201).json({
      newRepeatingTransaction: repeatingTransactionPopulated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRepeatingTransaction = async (req, res) => {
  try {
    const { repeatingTransactionId } = req.body;
    const repeatingTransaction = await RepeatingTransaction.findById(
      repeatingTransactionId
    );

    if (!repeatingTransaction) {
      return res
        .status(404)
        .json({ message: "Repeating Transaction not found" });
    }

    if (repeatingTransaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await repeatingTransaction.deleteOne();
    res.status(200).json({ message: "Repeating Transaction removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

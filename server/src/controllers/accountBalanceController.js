const AccountBalance = require("../models/AccountBalance");

exports.getAccountBalances = async (req, res) => {
  try {
    const accountBalances = await AccountBalance.find({
      user: req.user.id,
    }).sort({ date: -1, createdAt: -1 });

    res.status(200).json(accountBalances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching account balances", error });
  }
};

exports.setAccountBalance = async (req, res) => {
  try {
    const accountBalance = await AccountBalance.create({
      user: req.user.id,
      amount: req.body.amount,
    });

    res.status(201).json({ accountBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAccountBalance = async (userId, transactionId, amount, date) => {
  const latestBeforeDate = await AccountBalance.findOne({
    user: userId,
    date: { $lte: date },
  }).sort({ date: -1, createdAt: -1 });

  const newAmount = latestBeforeDate
    ? latestBeforeDate.amount + Number(amount)
    : Number(amount);

  const newAccountBalance = await AccountBalance.create({
    user: userId,
    transaction: transactionId,
    amount: newAmount,
    date,
  });

  updateSubsequentAccountBalances(userId, amount, date);

  return newAccountBalance;
};

exports.deleteAccountBalance = async (userId, transactionId, amount, date) => {
  await AccountBalance.deleteOne({ user: userId, transaction: transactionId });
  await updateSubsequentAccountBalances(userId, amount, date);
};

const updateSubsequentAccountBalances = async (userId, amount, date) => {
  const subsequentAccountBalances = await AccountBalance.find({
    user: userId,
    date: { $gt: date },
  }).sort({ date: 1, createdAt: 1 });

  for (const balance of subsequentAccountBalances) {
    await AccountBalance.updateOne(
      { _id: balance._id },
      { amount: balance.amount + Number(amount) }
    );
  }
};

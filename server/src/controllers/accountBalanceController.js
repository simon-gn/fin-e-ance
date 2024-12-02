const AccountBalance = require("../models/AccountBalance");

exports.getAccountBalances = async (req, res) => {
  try {
    const accountBalances = await AccountBalance.find({
      user: req.user.id,
    }).sort({ date: -1 });

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

exports.updateAccountBalance = async (userId, amount) => {
  const latestAccountBalance = await AccountBalance.findOne({
    user: userId,
  }).sort({
    date: -1,
  });

  const newAccountBalance = await AccountBalance.create({
    user: userId,
    amount: latestAccountBalance.amount + Number(amount),
  });

  return newAccountBalance;
};

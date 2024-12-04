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

exports.updateAccountBalance = async (userId, amount, date) => {
  const latestBeforeDate = await AccountBalance.findOne({
    user: userId,
    date: { $lt: date },
  }).sort({ date: -1 });

  const newAmount = latestBeforeDate
    ? latestBeforeDate.amount + Number(amount)
    : Number(amount);

  const newAccountBalance = await AccountBalance.create({
    user: userId,
    amount: newAmount,
    date,
  });

  const subsequentAccountBalances = await AccountBalance.find({
    user: userId,
    date: { $gt: date },
  }).sort({ date: 1 });

  for (const balance of subsequentAccountBalances) {
    await AccountBalance.updateOne(
      { _id: balance._id },
      { amount: balance.amount + Number(amount) }
    );
  }

  return newAccountBalance;
};

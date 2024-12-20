const mongoose = require("mongoose");

const accountBalanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AccountBalance", accountBalanceSchema);

const mongoose = require("mongoose");

const RepeatingTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Income", "Expense"], required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true,
  },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model(
  "RepeatingTransaction",
  RepeatingTransactionSchema
);

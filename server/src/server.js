const mongoose = require("mongoose");
const app = require("./index");
const Category = require("./models/Category");
const { startDailyCleanUpCronJob } = require("./cron_jobs/dailyCleanUpCronJob");
const {
  startRepeatingTransactionsCronJob,
} = require("./cron_jobs/repeatingTransactionsCronJob");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// MongoDB connection
if (process.env.NODE_ENV !== "test") {
  if (!mongoose.connection.readyState) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log(err));
  }
}

// Ensure default Category exists
const ensureDefaultCategory = async () => {
  const defaultCategory = await Category.findOne({ name: "Uncategorized" });
  if (!defaultCategory) {
    await Category.create({ name: "Uncategorized", color: "#cccccc" });
    console.log('Default "Uncategorized" category created.');
  }
};
ensureDefaultCategory();

// Start cron jobs
if (process.env.NODE_ENV !== "test") {
  startDailyCleanUpCronJob();
  startRepeatingTransactionsCronJob();
}

module.exports = app;

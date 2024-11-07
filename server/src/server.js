const mongoose = require("mongoose");
const app = require("./index");
const Category = require('./models/Category');
const { startCronJob } = require("./cron");
require("dotenv").config();

// MongoDB connection
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}

// Ensure default Category exists
const ensureDefaultCategory = async () => {
  const defaultCategory = await Category.findOne({ name: 'Uncategorized' });
  if (!defaultCategory) {
    await Category.create({ name: 'Uncategorized', color: '#cccccc' });
    console.log('Default "Uncategorized" category created.');
  }
};
ensureDefaultCategory();

// Start cron job to delete old tokens
if (process.env.NODE_ENV !== "test") {
  startCronJob();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

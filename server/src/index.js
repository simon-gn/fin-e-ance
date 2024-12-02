const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const accountBalanceRoutes = require("./routes/accountBalanceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://fin-e-ance-simon-gns-projects.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accountBalances", accountBalanceRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("fin(e)ance.");
});

module.exports = app;

const cron = require("node-cron");
const RepeatingTransaction = require("../models/RepeatingTransaction");
const Transaction = require("../models/Transaction");
const {
  addAccountBalance,
} = require("../controllers/accountBalanceController");

exports.startRepeatingTransactionsCronJob = async () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Start cron job:");
    try {
      let today = new Date();
      today.setHours(today.getHours() + 1); // for correct TimeZone

      const repeatingTransactions = await RepeatingTransaction.find({
        isActive: true,
      });

      for (const transaction of repeatingTransactions) {
        const {
          startDate,
          endDate,
          frequency,
          userId,
          type,
          category,
          amount,
          description,
        } = transaction;

        if (startDate <= today && (!endDate || endDate >= today)) {
          const shouldCreateTransaction = checkFrequencyMatch(
            frequency,
            startDate,
            today
          );

          if (shouldCreateTransaction) {
            const newTransaction = await Transaction.create({
              user: userId,
              type,
              date: today,
              category,
              amount,
              description,
            });

            await addAccountBalance(
              userId,
              newTransaction._id,
              type === "Expense" ? -amount : amount,
              today
            );
          }
        }
      }
    } catch (error) {
      console.error("Error in repeating transaction cron job:", error);
    }
  });
};

function checkFrequencyMatch(frequency, startDate, today) {
  switch (frequency) {
    case "daily":
      return true;
    case "weekly": {
      const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      return diff % 7 === 0;
    }
    case "monthly":
      return startDate.getDate() === today.getDate();
    case "yearly":
      return (
        startDate.getDate() === today.getDate() &&
        startDate.getMonth() === today.getMonth()
      );
    default:
      return false;
  }
}

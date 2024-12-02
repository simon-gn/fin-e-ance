import { format, subMonths, isSameMonth } from "date-fns";

export const calculateMonthlyTotals = (transactions) => {
  const currentMonth = new Date();

  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);

    if (isSameMonth(transactionDate, currentMonth)) {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "Expense") {
        totalExpenses += transaction.amount;
      }
    }
  });

  return { totalIncome, totalExpenses };
};

export const calculateExpensesByCategory = (transactions, limit = 5) => {
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === "Expense") {
      if (!acc[transaction.category.name]) {
        acc[transaction.category.name] = {
          total: 0,
          color: transaction.category.color,
        };
      }
      acc[transaction.category.name].total += transaction.amount;
    }
    return acc;
  }, {});

  return Object.entries(categoryTotals)
    .map(([category, { total, color }]) => ({ category, total, color }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

export const processMonthlySpendingData = (transactions) => {
  const data = [];

  for (let i = 5; i >= 0; i--) {
    const month = format(subMonths(new Date(), i), "MMM yyyy");
    const monthlyTotal = transactions
      .filter(
        (txn) =>
          txn.type === "Expense" &&
          format(new Date(txn.date), "MMM yyyy") === month
      )
      .reduce((sum, txn) => sum + txn.amount, 0);
    data.push({ month, spending: monthlyTotal });
  }
  return data;
};

export const processMonthlyIncomeExpense = (transactions) => {
  const data = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // Create a unique key for each month

    if (!data[monthKey]) {
      data[monthKey] = { income: 0, expense: 0 };
    }

    if (transaction.type === "Income") {
      data[monthKey].income += transaction.amount;
    } else if (transaction.type === "Expense") {
      data[monthKey].expense += transaction.amount;
    }
  });

  return data;
};

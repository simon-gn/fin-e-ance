import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import DateFilterBar from "../components/dashboard_elements/DateFilterBar";
import IncomeExpenseSummary from "../components/dashboard_elements/IncomeExpenseSummary";
import TopSpendingCategories from "../components/dashboard_elements/TopSpendingCategories";
import RecentTransactions from "../components/dashboard_elements/RecentTransactions";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import SpendingTrendChart from "../components/charts/SpendingTrendChart";
import IncomeExpenseComparisonChart from "../components/charts/IncomeExpenseComparisonChart";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const { transactions } = useSelector((state) => state.transactions);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (dateRange.startDate !== null && dateRange.endDate !== null) {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate < dateRange.startDate ||
          transactionDate > dateRange.endDate
        ) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, dateRange]);

  return (
    <div className={styles.dashboard}>
      {/* Date Filter Bar */}
      <DateFilterBar setDateRange={setDateRange} />

      <div className={styles.content}>
        <div className={styles.column}>
          <IncomeExpenseSummary transactions={filteredTransactions} />
          <RecentTransactions transactions={transactions} />
          {window.isMobile && (
            <div className="card">
              <h3>Expenses by Category</h3>
              <CategoryBreakdownChart transactions={filteredTransactions} />
            </div>
          )}
          <TopSpendingCategories transactions={filteredTransactions} />
        </div>

        <div className={styles.column}>
          {!window.isMobile && (
            <div className="card">
              <h3>Expenses by Category</h3>
              <CategoryBreakdownChart transactions={filteredTransactions} />
            </div>
          )}

          <div className="card">
            <h3>Spending Trend</h3>
            <SpendingTrendChart />
          </div>

          <div className="card">
            <h3>Income vs. Expense</h3>
            <IncomeExpenseComparisonChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

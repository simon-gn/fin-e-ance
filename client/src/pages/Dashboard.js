import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionsAction } from "../redux/actions/transactionActions";
import { fetchCategoriesAction } from "../redux/actions/categoryActions";
import DateFilterBar from "../components/dashboard_elements/DateFilterBar";
import IncomeExpenseSummary from "../components/dashboard_elements/IncomeExpenseSummary";
import TopSpendingCategories from "../components/dashboard_elements/TopSpendingCategories";
import RecentTransactions from "../components/dashboard_elements/RecentTransactions";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import SpendingTrendChart from "../components/charts/SpendingTrendChart";
import IncomeExpenseComparisonChart from "../components/charts/IncomeExpenseComparisonChart";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState({startDate: null, endDate: null});

  useEffect(() => {
    dispatch(fetchTransactionsAction());
    dispatch(fetchCategoriesAction());
  }, [dispatch]);
  
  const { transactions } = useSelector((state) => state.transactions);

  const filteredTransactions = transactions.filter(transaction => {
    // return all transactions
    if (dateRange.startDate === null || dateRange.endDate === null) {
      return true;
    }

    const transactionDate = new Date(transaction.date);
    return transactionDate >= dateRange.startDate && transactionDate <= dateRange.endDate;
  });

  return (
    <div className={styles.dashboard}>
      {/* Date Filter Bar */}
      <DateFilterBar
        setDateRange={setDateRange}
      />

      <div className={styles.content}>
        {/* Summary Row */}
        <div className={styles.summaryColumn}>
          <IncomeExpenseSummary transactions={filteredTransactions} />
          <TopSpendingCategories transactions={filteredTransactions}/>
          <RecentTransactions transactions={transactions}/>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsColumn}>
          <div className={`${styles.chartBox} card`}>
            <h3>Category Breakdown</h3>
            <CategoryBreakdownChart transactions={filteredTransactions}/>
          </div>

          <div className={`${styles.chartBox} card`}>
            <h3>Spending Trend Over Time</h3>
            <SpendingTrendChart />
          </div>

          <div className={`${styles.chartBox} card`}>
            <h3>Income vs. Expense Comparison</h3>
            <IncomeExpenseComparisonChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

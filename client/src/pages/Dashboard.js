import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { fetchTransactionsAction } from "../redux/actions/transactionActions";
import IncomeExpenseSummary from "../components/dashboard_elements/IncomeExpenseSummary";
import TopSpendingCategories from "../components/dashboard_elements/TopSpendingCategories";
import RecentTransactions from "../components/dashboard_elements/RecentTransactions";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import SpendingTrendChart from "../components/charts/SpendingTrendChart";
import IncomeExpenseComparisonChart from "../components/charts/IncomeExpenseComparisonChart";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransactionsAction());
  }, [dispatch]
  );

  return (
    <div className={styles.dashboard}>
      {/* Summary Row */}
      <div className={styles.summaryColumn}>
        <IncomeExpenseSummary />
        <TopSpendingCategories />
        <RecentTransactions />
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsColumn}>
        <div className={`${styles.chartBox} card`}>
          <h3>Category Breakdown</h3>
          <CategoryBreakdownChart />
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
  );
};

export default Dashboard;

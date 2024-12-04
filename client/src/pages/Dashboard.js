import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountBalancesAction } from "../redux/actions/accountBalanceActions";
import { filterByDate } from "../utils/miscUtils";
import DateFilterBar from "../components/dashboard_elements/DateFilterBar";
import IncomeExpenseSummary from "../components/dashboard_elements/IncomeExpenseSummary";
import TopSpendingCategories from "../components/dashboard_elements/TopSpendingCategories";
import RecentTransactions from "../components/dashboard_elements/RecentTransactions";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import SpendingTrendChart from "../components/charts/SpendingTrendChart";
import IncomeExpenseComparisonChart from "../components/charts/IncomeExpenseComparisonChart";
import AccountBalance from "../components/dashboard_elements/AccountBalance";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const { transactions } = useSelector((state) => state.transactions);
  const { accountBalances } = useSelector((state) => state.accountBalances);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAccountBalancesAction());
  }, [dispatch]);

  const filteredTransactions = useMemo(
    () => filterByDate(transactions, dateRange),
    [transactions, dateRange]
  );

  const filteredAccountBalances = useMemo(
    () => filterByDate(accountBalances, dateRange),
    [accountBalances, dateRange]
  );

  return (
    <div className={styles.dashboard}>
      <DateFilterBar setDateRange={setDateRange} />

      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.balanceAndIncomeExpenseContainer}>
            <AccountBalance accountBalances={filteredAccountBalances} />
            <IncomeExpenseSummary transactions={filteredTransactions} />
          </div>
          {window.isMobile && (
            <CategoryBreakdownChart transactions={filteredTransactions} />
          )}
          <RecentTransactions transactions={transactions} />
          <TopSpendingCategories transactions={filteredTransactions} />
        </div>

        <div className={styles.column}>
          {!window.isMobile && (
            <CategoryBreakdownChart transactions={filteredTransactions} />
          )}
          <SpendingTrendChart />
          <IncomeExpenseComparisonChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

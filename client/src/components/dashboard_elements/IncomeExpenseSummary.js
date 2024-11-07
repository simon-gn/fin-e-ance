import React from 'react';
import { useSelector } from 'react-redux';
import { calculateMonthlyTotals } from '../../utils/transactionUtils';
import styles from './IncomeExpenseSummary.module.css';

const IncomeExpenseSummary = () => {
  const { transactions } = useSelector((state) => state.transactions);
  const { totalIncome, totalExpenses } = calculateMonthlyTotals(transactions);

  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className={`${styles.incomeExpenseSummary} card`}>
      <h2>{monthName}</h2>
      <div className={styles.summaryContent}>
        <div className={`${styles.summaryBox} ${styles.income}`}>
          <span className={styles.label}>Income</span>
          <span className={styles.amount}>${totalIncome.toFixed(2)}</span>
        </div>
        <div className={`${styles.summaryBox} ${styles.expense}`}>
          <span className={styles.label}>Expenses</span>
          <span className={styles.amount}>-${totalExpenses.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseSummary;

import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './RecentTransactions.module.css';

const RecentTransactions = () => {
  const { transactions } = useSelector((state) => state.transactions);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className={`${styles.recentTransactions} card`}>
      <h3>Recent Transactions</h3>
      <ul className={styles.transactionList}>
        {recentTransactions.map((transaction) => (
          <li key={transaction._id} className={styles.transactionItem}>
            <span className={styles.transactionDate}>
              {new Date(transaction.date).toLocaleDateString()}
            </span>
            <span className={styles.transactionCategory}>{transaction.category.name}</span>
            <span className={styles.transactionAmount} style={{color: transaction.type === 'Income' ? '#76c7c0' : '#ff6b6b' }}>{transaction.type === 'Expense' ? '-' : '+'}${transaction.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <Link to="/transactions" className={styles.viewAllLink}>View All</Link>
    </div>
  );
};

export default RecentTransactions;

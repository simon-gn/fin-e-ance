import React from "react";
import PropTypes from "prop-types";
import { calculateExpensesByCategory } from "../../utils/transactionUtils";
import styles from "./TopSpendingCategories.module.css";

const TopSpendingCategories = ({ transactions }) => {
  const topCategories = calculateExpensesByCategory(transactions);

  const minLength = 1.5;
  const maxLength = 100;

  let sumTotals = 0;
  topCategories.forEach((category) => {
    sumTotals += category.total;
  });

  const calculateBarLength = (total) => {
    const width = (maxLength * total) / sumTotals;
    if (width < minLength) return minLength;
    return width;
  };

  return (
    <div className="card">
      <h3>Top Spending Categories</h3>
      <ul className={styles.categoryList}>
        {topCategories.map(({ category, total }) => (
          <li key={category} className={styles.categoryItem}>
            <span className={styles.categoryName}>{category}</span>
            <span
              className={styles.categoryBar}
              style={{ width: `${calculateBarLength(total)}%` }}
            />
            <span className={styles.categoryTotal}>${total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

TopSpendingCategories.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default TopSpendingCategories;

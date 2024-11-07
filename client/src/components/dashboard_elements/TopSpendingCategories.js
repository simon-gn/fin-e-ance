// components/TopSpendingCategories.js
import React from "react";
import { useSelector } from "react-redux";
import { calculateTopSpendingCategories } from "../../utils/transactionUtils";
import styles from "./TopSpendingCategories.module.css";

const TopSpendingCategories = () => {
  const { transactions } = useSelector((state) => state.transactions);
  const topCategories = calculateTopSpendingCategories(transactions);

  const minLength = 10;
  const maxLength = 300;

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
    <div className={`${styles.topSpendingCategories} card`}>
      <h3>Top Spending Categories</h3>
      <ul className={styles.categoryList}>
        {topCategories.map(({ category, total }) => (
          <li key={category} className={styles.categoryItem}>
            <span className={styles.categoryName}>{category}</span>
            <span
              className={styles.categoryBar}
              style={{ width: `${calculateBarLength(total)}px` }}
            />
            <span className={styles.categoryTotal}>${total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSpendingCategories;

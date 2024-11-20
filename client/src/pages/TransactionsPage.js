import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineFilter } from "react-icons/ai";
import {
  fetchTransactionsAction,
  deleteTransactionAction,
} from "../redux/actions/transactionActions";
import { fetchCategoriesAction } from "../redux/actions/categoryActions";
import { getDateRange, formatDate } from "../utils/miscUtils";
import styles from "./TransactionsPage.module.css";

const TransactionPage = () => {
  const [dateRange, setDateRange] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [showFilterForm, setShowFilterForm] = useState(false);

  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    try {
      const { startDate, endDate } = getDateRange(
        dateRange,
        customStartDate,
        customEndDate,
      );

      dispatch(fetchTransactionsAction(type, category, startDate, endDate));
    } catch (err) {
      console.error(err);
    }
  }, [type, category, dateRange, customStartDate, customEndDate, dispatch]);

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(
      transactionId === selectedTransactionId ? null : transactionId,
    ); // Toggle selected transaction
  };

  const handleRemoveTransaction = (transactionId) => {
    dispatch(deleteTransactionAction(transactionId));
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className={styles.transactionsPage}>
      <div className={`${styles.transactionsPageBox} card`}>
        {/* Filter Section */}
        <button
          className={styles.filterButton}
          type="button"
          onClick={() => setShowFilterForm(!showFilterForm)}
        >
          <AiOutlineFilter size={20} />
          {showFilterForm ? "Cancel" : "Filter"}
        </button>
        {showFilterForm && (
          <form className={styles.filterForm}>
            <div>
              <label htmlFor="filter-date-range">Filter by Date</label>
              <select
                id="filter-date-range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="">All</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7d">Last 7 Days</option>
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Month</option>
                <option value="6m">Last 6 Month</option>
                <option value="1y">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-category">Filter by Category</label>
              <select
                id="filter-category"
                name="filterCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-type">Filter by Type</label>
              <select
                id="filter-type"
                name="filterType"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            {/* If 'Custom Range' is selected, show date inputs */}
            {dateRange === "custom" && (
              <div className={styles.dateInputsContainer}>
                <div>
                  <label htmlFor="custom-start-date">Start Date</label>
                  <input
                    type="date"
                    id="custom-start-date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="custom-end-date">End Date</label>
                  <input
                    type="date"
                    id="custom-end-date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </form>
        )}

        {/* Transaction List */}
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className={selectedTransactionId === transaction._id ? styles.selected : ""}
                onClick={() => handleTransactionClick(transaction._id)}
              >
                <td>{formatDate(transaction.date)}</td>
                <td
                  style={{
                    color:
                      transaction.type === "Income"
                        ? "var(--income_color)"
                        : "var(--expense_color)",
                    fontWeight: "bold",
                  }}
                >
                  {transaction.type === "Expense" ? "-" : "+"}$
                  {transaction.amount.toFixed(2)}
                </td>
                <td>{transaction.category.name}</td>
                <td>{transaction.description}</td>
                {selectedTransactionId === transaction._id && (
                  <td className={styles.actionCell}>
                    <div
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTransaction(transaction._id);
                      }}
                    >
                      <AiOutlineDelete size={24} />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionPage;

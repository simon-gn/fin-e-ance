import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactionsAction,
  deleteTransactionAction,
} from "../redux/actions/transactionActions";
import { fetchCategoriesAction } from "../redux/actions/categoryActions";
import AddTransactionModal from "../components/modals/AddTransactionModal";
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
  const { transactions } = useSelector((state) => state.transactions);
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

  // Adding new transactions
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const handleOpenAddTransactionModal = () => {
    setIsAddTransactionModalOpen(true);
  };
  const handleCloseAddTransactionModal = () => {
    setIsAddTransactionModalOpen(false);
  };

  return (
    <div className={styles.transactionsPage}>
      <div className={`${styles.transactionsPageBox} card`}>
        {/* Add Transaction Modal */}
        {!isAddTransactionModalOpen && (
          <button onClick={handleOpenAddTransactionModal}>
            New Transaction
          </button>
        )}
        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          onClose={handleCloseAddTransactionModal}
        />

        {/* Filter Section */}
        <div className={styles.filterButton}>
          <button onClick={() => setShowFilterForm(!showFilterForm)}>
            {showFilterForm ? "Cancel" : "Filter"}
          </button>
        </div>
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
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last Month">Last Month</option>
                <option value="Last 3 Month">Last 3 Month</option>
                <option value="Last 6 Month">Last 6 Month</option>
                <option value="Last Year">Last Year</option>
                <option value="Custom Range">Custom Range</option>
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
            {dateRange === "Custom Range" && (
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
                onClick={() => handleTransactionClick(transaction._id)}
              >
                <td>{formatDate(transaction.date)}</td>
                <td
                  style={{
                    color:
                      transaction.type === "Income" ? "#76c7c0" : "#ff6b6b",
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
                    <button
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTransaction(transaction._id);
                      }}
                    >
                      Remove
                    </button>
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

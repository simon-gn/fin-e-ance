import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineFilter } from "react-icons/ai";
import { deleteTransactionAction } from "../redux/actions/transactionActions";
import { getDateRange, formatDate } from "../utils/miscUtils";
import styles from "./TransactionsPage.module.css";

const TransactionPage = () => {
  const [dateFilterOption, setDateFilterOption] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null,
  });
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [showFilterForm, setShowFilterForm] = useState(false);

  const { transactions } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);

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

      if (type && type !== "all" && transaction.type !== type) {
        return false;
      }

      if (category && category !== "all" && transaction.category.name !== category) {
        return false;
      }

      return true;
    });
  }, [transactions, dateRange, type, category]);

  const handleFilterChange = useCallback(
    (option) => {
      setDateFilterOption(option)
      const { startDate, endDate } = getDateRange(
        option,
        customDateRange.start,
        customDateRange.end,
      );
      setDateRange({ startDate, endDate });
    },
    [customDateRange, setDateRange],
  );

  const handleCustomDateChange = (start, end) => {
    setCustomDateRange({ start, end });
  };

  useEffect(() => {
    handleFilterChange(dateFilterOption);
  }, [customDateRange, dateFilterOption, handleFilterChange]);
  
  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(
      transactionId === selectedTransactionId ? null : transactionId,
    ); // Toggle selected transaction
  };
  
  const dispatch = useDispatch();
  const handleRemoveTransaction = (transactionId) => {
    dispatch(deleteTransactionAction(transactionId));
  };

  return (
    <div className={styles.transactionsPage}>
      <div className="card">
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
          <form>
            <div className={styles.filterForm}>
              <div>
                <label htmlFor="filter-date-range">Date</label>
                <select
                  id="filter-date-range"
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="all">All</option>
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
                <label htmlFor="filter-category">Category</label>
                <select
                  id="filter-category"
                  name="filterCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filter-type">Type</label>
                <select
                  id="filter-type"
                  name="filterType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
            </div>
            {/* If 'Custom Range' is selected, show date inputs */}
            {dateFilterOption === "custom" && (
              <div className={styles.dateInputsContainer}>
                <div>
                  <label htmlFor="custom-start-date">Start Date</label>
                  <input
                    type="date"
                    id="custom-start-date"
                    value={customDateRange.start || ""}
                    onChange={(e) => handleCustomDateChange(e.target.value, customDateRange.end)}
                  />
                </div>
                <div>
                  <label htmlFor="custom-end-date">End Date</label>
                  <input
                    type="date"
                    id="custom-end-date"
                    value={customDateRange.end || ""}
                    onChange={(e) => handleCustomDateChange(customDateRange.start, e.target.value)}
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
            {filteredTransactions.map((transaction) => (
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
                <td>
                  {selectedTransactionId !== transaction._id ? (
                    transaction.description
                  ) : (
                    <div
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTransaction(transaction._id);
                      }}
                    >
                      <AiOutlineDelete size={24} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionPage;

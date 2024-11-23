import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineFilter } from "react-icons/ai";
import { deleteTransactionAction } from "../redux/actions/transactionActions";
import FilterTransactionsForm from "../components/modals_and_forms/FilterTransactionsForm";
import { formatDate } from "../utils/miscUtils";
import styles from "./TransactionsPage.module.css";

const ITEMS_PER_PAGE = 15;
const MAX_PAGE_BUTTONS = 3;

const TransactionPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [showFilterTransactionsForm, setShowFilterTransactionsForm] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { transactions } = useSelector((state) => state.transactions);

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

      if (
        category &&
        category !== "all" &&
        transaction.category.name !== category
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, dateRange, type, category]);

  const paginatedTransactions = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(
      transactionId === selectedTransactionId ? null : transactionId
    ); // Toggle selected transaction
  };

  const dispatch = useDispatch();
  const handleRemoveTransaction = (transactionId) => {
    dispatch(deleteTransactionAction(transactionId));
  };

  const createPaginationButtons = () => {
    const buttons = [];
    const leftBoundary = Math.max(
      currentPage - Math.floor(MAX_PAGE_BUTTONS / 2),
      1
    );
    const rightBoundary = Math.min(
      leftBoundary + MAX_PAGE_BUTTONS - 1,
      totalPages
    );

    if (leftBoundary > 1) {
      buttons.push(
        <button key={1} onClick={() => setCurrentPage(1)}>
          1
        </button>
      );
      if (leftBoundary > 2) {
        buttons.push(<span key="ellipsis-start">...</span>);
      }
    }

    for (let i = leftBoundary; i <= rightBoundary; i++) {
      buttons.push(
        <button
          key={i}
          className={currentPage === i ? styles.activePage : ""}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    if (rightBoundary < totalPages) {
      if (rightBoundary < totalPages - 1) {
        buttons.push(<span key="ellipsis-end">...</span>);
      }
      buttons.push(
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className={styles.transactionsPage}>
      <div className="card">
        {/* Filter Section */}
        <button
          className={styles.filterButton}
          type="button"
          onClick={() =>
            setShowFilterTransactionsForm(!showFilterTransactionsForm)
          }
        >
          <AiOutlineFilter size={20} />
          {showFilterTransactionsForm ? "Cancel" : "Filter"}
        </button>
        {showFilterTransactionsForm && (
          <FilterTransactionsForm
            setDateRange={setDateRange}
            setType={setType}
            setCategory={setCategory}
          />
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
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction._id}
                className={
                  selectedTransactionId === transaction._id
                    ? styles.selected
                    : ""
                }
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

        {/* Pagination */}
        <div className={styles.pagination}>{createPaginationButtons()}</div>
      </div>
    </div>
  );
};

export default TransactionPage;

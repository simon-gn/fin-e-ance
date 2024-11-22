import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineFilter } from "react-icons/ai";
import { deleteTransactionAction } from "../redux/actions/transactionActions";
import FilterTransactionsForm from "../components/modals_and_forms/FilterTransactionsForm";
import { formatDate } from "../utils/miscUtils";
import styles from "./TransactionsPage.module.css";

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

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(
      transactionId === selectedTransactionId ? null : transactionId
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
            {filteredTransactions.map((transaction) => (
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
      </div>
    </div>
  );
};

export default TransactionPage;

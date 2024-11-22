import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addTransactionAction } from "../../redux/actions/transactionActions";
import styles from "./AddTransactionModal.module.css";

const AddTransactionModal = ({ isOpen, onClose }) => {
  const now = new Date();
  const todayDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [type, setType] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState(todayDate);
  const [time, setTime] = useState(currentTime);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const handleSave = () => {
    const date = new Date(`${transactionDate}T${time}`);
    dispatch(addTransactionAction({ type, date, category, amount, description }));
    onClose();
  };

  return (
    isOpen && (
      <div className={styles.modalOverlay}>
        <form
          className={styles.addTransactionForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className={styles.dateTimeGroup}>
            <div className={styles.dateContainer}>
              <label htmlFor="date">Date:</label>
              <input
                id="date"
                name="date"
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
              />
            </div>
            <div className={styles.timeContainer}>
              <label htmlFor="time">Time:</label>
              <input
                id="time"
                name="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.categoryAmountGroup}>
            <div className={styles.categoryContainer}>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.amountContainer}>
              <label htmlFor="amount">Amount:</label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  );
};

AddTransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTransactionModal;

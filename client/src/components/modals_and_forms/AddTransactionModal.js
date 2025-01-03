import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addTransactionAction } from "../../redux/actions/transactionActions";
import { addRepeatingTransactionAction } from "../../redux/actions/repeatingTransactionActions";
import styles from "./AddTransactionModal.module.css";

const AddTransactionModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("normal");
  const [type, setType] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();

      setTransactionDate(now.toLocaleDateString("en-CA"));
      setTime(now.toTimeString().slice(0, 5));
      setStartDate(now.toLocaleDateString("en-CA"));
    }
  }, [isOpen]);

  const handleSave = () => {
    if (activeTab === "normal") {
      const date = new Date(`${transactionDate}T${time}`);
      dispatch(
        addTransactionAction({ type, date, category, amount, description })
      );
    } else {
      dispatch(
        addRepeatingTransactionAction({
          type,
          amount,
          category,
          description,
          frequency,
          startDate,
          endDate: endDate || null,
        })
      );
    }
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
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${activeTab === "normal" ? styles.activeTab : ""}`}
              type="button"
              onClick={() => setActiveTab("normal")}
            >
              Transaction
            </button>
            <button
              className={`${styles.tab} ${activeTab === "repeating" ? styles.activeTab : ""}`}
              type="button"
              onClick={() => setActiveTab("repeating")}
            >
              Standing Order
            </button>
          </div>

          {activeTab === "normal" && (
            <>
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
                <div>
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
                <div>
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
            </>
          )}

          {activeTab === "repeating" && (
            <>
              <div className={styles.typeFrequencyGroup}>
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
                <div>
                  <label htmlFor="frequency">Frequency:</label>
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className={styles.dateTimeGroup}>
                <div>
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate">End Date (optional):</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}

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

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransactionAction } from "../../redux/actions/transactionActions";
import styles from "./AddTransactionModal.module.css";

const AddTransactionModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const handleSave = () => {
    dispatch(addTransactionAction({ type, amount, category, description }));
    onClose();
  };

  return (
    isOpen && (
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
        <div>
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
        <div>
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
        <button type="submit">Add Transaction</button>
        <button type="button" onClick={() => onClose()}>
          Cancel
        </button>
      </form>
    )
  );
};

export default AddTransactionModal;

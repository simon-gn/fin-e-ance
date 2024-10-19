import React, { useEffect, useState } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from '../services/api'; // Import addTransaction function

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // To toggle the transaction form
  const [type, setType] = useState('income'); // New transaction state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [activeTransactionId, setActiveTransactionId] = useState(null); // Track the active transaction

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getTransactions(token);
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newTransaction = { type, amount, category, description };
      const savedTransaction = await addTransaction(newTransaction, token);
      setTransactions((prevTransactions) => [...prevTransactions, savedTransaction]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleTransactionClick = (transactionId) => {
    setActiveTransactionId(transactionId === activeTransactionId ? null : transactionId); // Toggle active transaction
  };

  const handleRemoveTransaction = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteTransaction(transactionId, token);
      setTransactions(transactions.filter(transaction => transaction._id !== transactionId)); // Remove from state
    } catch (err) {
      console.error('Error removing transaction:', err);
    }
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Transaction'}
      </button>

      {showForm && (
        <form onSubmit={handleAddTransaction} style={{ marginTop: '20px' }}>
          <div>
            <label>Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit">Add Transaction</button>
        </form>
      )}

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id} onClick={() => handleTransactionClick(transaction._id)} style={{ cursor: 'pointer' }}>
            {transaction.type} - ${transaction.amount} - {transaction.category} - {transaction.description}
            {activeTransactionId === transaction._id && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent click event
                  handleRemoveTransaction(transaction._id);
                }}
                style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

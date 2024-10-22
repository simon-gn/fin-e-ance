import React, { useEffect, useState } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from '../services/api';
import TransactionBarChart from './TransactionBarChart';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // To toggle the transaction form
  const [activeTransactionId, setActiveTransactionId] = useState(null); // Track the active transaction

  // States for adding new transactions
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // States for filtering
  const [filterType, setFilterType] = useState(''); // All, income, expense
  const [filterCategory, setFilterCategory] = useState(''); // Filter by category

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

  // Filter transactions based on selected type and category
  const filteredTransactions = transactions.filter(transaction => {
    return (
      (filterType === '' || transaction.type === filterType) && 
      (filterCategory === '' || transaction.category === filterCategory)
    );
  });

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="dashboard" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Dashboard</h2>

      {/* Charts */}
      <div style={{ height: '400px', marginBottom: '50px' }}>
        <TransactionBarChart transactions={filteredTransactions} />
      </div>

      {/* Button Add Transaction */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'New Transaction'}
      </button>

      {/* Transaction Form */}
      {showForm && (
        <form onSubmit={handleAddTransaction} style={{ marginTop: '20px' }}>
          <div>
            <label htmlFor="type">Type:</label>
            <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food">Food</option>
              <option value="Drinks">Drinks</option>
              <option value="Clothing">Clothing</option>
              <option value="Car">Car</option>
              <option value="Groceries">Groceries</option>
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
        </form>
      )}

      {/* Filter Taskbar */}
      <div style={{ marginTop: '20px' }}>
        <h3>Filter Transactions</h3>
        <div>
          <label htmlFor="filter-type">Filter by Type: </label>
          <select
            id="filter-type"
            name="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-category">Filter by Category: </label>
          <select
            id="filter-category"
            name="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Food">Food</option>
            <option value="Drinks">Drinks</option>
            <option value="Clothing">Clothing</option>
            <option value="Car">Car</option>
            <option value="Groceries">Groceries</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <ul>
        {filteredTransactions.map((transaction) => (
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

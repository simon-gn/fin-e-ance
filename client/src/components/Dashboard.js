import React, { useEffect, useState } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from '../services/api';
import BarChart from './BarChart';
import './Dashboard.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null); // Track the current selected transaction

  // States for toggling form
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);

  // States for adding new transactions
  const [type, setType] = useState('Expense');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // States for filtering
  const [filterType, setFilterType] = useState(''); // All, Income, Expense
  const [filterCategory, setFilterCategory] = useState(''); // Filter by category

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getTransactions(token);
        setTransactions(response.data);
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
      const response = await addTransaction(newTransaction, token);
      setTransactions((prevTransactions) => [...prevTransactions, response.data]);
      setShowNewTransactionForm(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(transactionId === selectedTransactionId ? null : transactionId); // Toggle active transaction
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
    <div className="dashboard">

      <div className='hero_section'>
        <h1>Your dashboard</h1>
      </div>

      <div className="dashboard-box">

        {/* New Transaction Section */}
        <div className='new-transaction-section'>
          {!showNewTransactionForm && (
            <button onClick={() => setShowNewTransactionForm(true)}>
              New Transaction
            </button>
          )}
          {showNewTransactionForm && (
            <form className="new-transaction-form" onSubmit={handleAddTransaction}>
              <div>
                <label htmlFor="type">Type:</label>
                <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
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
              <button type="cancel" onClick={() => setShowNewTransactionForm(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
        
        {/* Filter Section */}
        <button onClick={() => setShowFilterForm(!showFilterForm)}>
          {showFilterForm ? 'Cancel' : 'Filter'}
        </button>
        {showFilterForm && (
          <form className="transaction-form">
            <div>
              <label htmlFor="filter-type">Filter by Type</label>
              <select
                id="filter-type"
                name="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-category">Filter by Category</label>
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
          </form>
        )}

        {/* Transaction List */}
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id} onClick={() => handleTransactionClick(transaction._id)}>
                <td>{transaction.type}</td>
                <td>${transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                {selectedTransactionId === transaction._id && (
                  <td className='action-cell'>
                    <button className="remove-btn" onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent click event
                      handleRemoveTransaction(transaction._id);
                    }}>
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Charts */}
      <div className="chart-box">
        <BarChart transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;

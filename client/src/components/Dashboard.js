import React, { useEffect, useState, useCallback } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from '../services/api';
import BarChart from './BarChart';
import './Dashboard.css';

// --- helper functions ---
const getDateRange = (range, customStartDate, customEndDate) => {
  let startDate = new Date();
  let endDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  switch (range) {
    case 'Today':
      break;
    case 'Yesterday':
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'Last 7 Days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'Last Month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'Last 3 Month':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'Last 6 Month':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case 'Last Year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'Custom Range':
      if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = null;
        endDate = null;
      }
      break;
    default:
      startDate = null;
      endDate = null;
  }
  
  return { startDate, endDate };
};

const formatDate = (date) => {
  const transactionDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  let day;
  
  if (transactionDate.toDateString() === today.toDateString())
    day = 'Today';
  else if (transactionDate.toDateString() === yesterday.toDateString())
    day = 'Yesterday';
  else
    day = transactionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `${day}, ${transactionDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
}
// ------

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null); // Track the current selected transaction

  // States for toggling forms
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);

  // States for adding new transactions
  const [type, setType] = useState('Expense');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // States for filtering
  const [filterDateRange, setFilterDateRange] = useState('');
  const [filterCustomStartDate, setFilterCustomStartDate] = useState('');
  const [filterCustomEndDate, setFilterCustomEndDate] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      const { startDate, endDate } = getDateRange(filterDateRange, filterCustomStartDate, filterCustomEndDate);
      const token = localStorage.getItem('accessToken');
      const response = await getTransactions(filterType, filterCategory, startDate, endDate, token);
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategory, filterDateRange, filterCustomStartDate, filterCustomEndDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const newTransaction = { type, amount, category, description };
      await addTransaction(newTransaction, token);
      fetchTransactions();
      setShowNewTransactionForm(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(transactionId === selectedTransactionId ? null : transactionId); // Toggle selected transaction
  };

  const handleRemoveTransaction = async (transactionId) => {
    try {
      const token = localStorage.getItem('accessToken');
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

      <div className='hero_section'>
        <h1>Your dashboard</h1>
      </div>

      <div className="dashboard-box">

        {/* New Transaction Section */}
        <div className='new-transaction-container'>
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
              <button type="button" onClick={() => setShowNewTransactionForm(false)}>
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
          <form className="filter-form">
            <div>
              <label htmlFor="filter-date-range">Filter by Date</label>
              <select
                id="filter-date-range"
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
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
            {/* If 'Custom Range' is selected, show date inputs */}
            {filterDateRange === 'Custom Range' && (
              <div className='date-inputs-container'>
                <div>
                  <label htmlFor="custom-start-date">Start Date</label>
                  <input
                    type="date"
                    id="custom-start-date"
                    value={filterCustomStartDate}
                    onChange={(e) => setFilterCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="custom-end-date">End Date</label>
                  <input
                    type="date"
                    id="custom-end-date"
                    value={filterCustomEndDate}
                    onChange={(e) => setFilterCustomEndDate(e.target.value)}
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
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} onClick={() => handleTransactionClick(transaction._id)}>
              <td>{formatDate(transaction.date)}</td>
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
        <BarChart transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;

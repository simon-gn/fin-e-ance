import axios from 'axios';

const API_URL = 'https://personal-finance-dashboard-x1fy.onrender.com';

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, userData);
  return response.data;
};

export const getTransactions = async (token) => {
  const response = await axios.get(`${API_URL}/api/transactions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addTransaction = async (transactionData, token) => {
  const response = await axios.post(`${API_URL}/api/transactions/add`, transactionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteTransaction = async (transactionId, token) => {
  const response = await axios.post(`${API_URL}/api/transactions/delete`, { transactionId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
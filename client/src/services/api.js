import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

export const getTransactions = async (token) => {
  const response = await axios.get(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addTransaction = async (transactionData, token) => {
  const response = await axios.post(`${API_URL}/transactions/add`, transactionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteTransaction = async (transactionId, token) => {
  const response = await axios.post(`${API_URL}/transactions/delete`, { transactionId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
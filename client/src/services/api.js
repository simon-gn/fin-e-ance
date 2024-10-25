import axios from 'axios';
import { handleLogout } from '../utils/authUtils';

// const API_URL = 'http://192.168.43.79:5000';
const API_URL = 'http://localhost:5000';
// const API_URL = 'https://personal-finance-dashboard-x1fy.onrender.com';

const apiClient = axios.create({ baseURL: API_URL });

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await apiClient.post('api/auth/refresh', { refreshToken });
  return { newAccessToken: response.data.accessToken, newRefreshToken: response.data.refreshToken };
}

// Interceptor to handle expired token
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Check if the error is due to token expiration
    if (error.response.status === 401 && error.response.data.msg === 'Token expired or invalid' && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { newAccessToken, newRefreshToken } = await refreshAccessToken();
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
        if (newAccessToken) {
          // Set the Authorization header on the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          localStorage.setItem('accessToken', newAccessToken);
          
          // Retry the original request with the new token
          return apiClient(originalRequest);
        }
      } catch (err) {
        // If refresh token has also expired or failed
        if (err.response && (err.response.status === 401 || err.response.status === 403) ) {
          handleLogout();
        }
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post(`/api/auth/register`, userData);
    return response;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return err.response;
    }
    throw err;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await apiClient.post(`/api/auth/login`, userData);
    return response;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return err.response;
    }
    throw err;
  }
};

export const validateTokenAPI = async (token) => {
  const response = await apiClient.get('/api/auth/validate-token', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
}

export const getTransactions = async (type, category, startDate, endDate, token) => {
  const response = await apiClient.get(`/api/transactions`, {
    params: { type, category, startDate, endDate },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

export const addTransaction = async (transactionData, token) => {
  const response = await apiClient.post(`/api/transactions/add`, transactionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

export const deleteTransaction = async (transactionId, token) => {
  const response = await apiClient.post(`/api/transactions/delete`, { transactionId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};
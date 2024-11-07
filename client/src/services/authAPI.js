import { apiClient } from "./apiClient";

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
  const response = await apiClient.get("/api/auth/validate-token", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

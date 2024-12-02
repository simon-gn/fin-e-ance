import { apiClient } from "./apiClient";

export const fetchAccountBalancesAPI = async (token) => {
  const response = await apiClient.get(`/api/accountBalances/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const setAccountBalanceAPI = async (amount, token) => {
  const response = await apiClient.post(`/api/accountBalances/set`, amount, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

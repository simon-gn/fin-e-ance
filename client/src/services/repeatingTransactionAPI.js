import { apiClient } from "./apiClient";

export const fetchRepeatingTransactionsAPI = async (token) => {
  const response = await apiClient.get(`/api/repeatingTransactions/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const addRepeatingTransactionAPI = async (
  repeatingTransactionData,
  token
) => {
  const response = await apiClient.post(
    `/api/repeatingTransactions/add`,
    repeatingTransactionData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

export const deleteRepeatingTransactionAPI = async (
  repeatingTransactionId,
  token
) => {
  const response = await apiClient.post(
    `/api/repeatingTransactions/delete`,
    { repeatingTransactionId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

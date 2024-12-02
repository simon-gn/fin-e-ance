import { apiClient } from "./apiClient";

export const fetchTransactionsAPI = async (
  type,
  category,
  startDate,
  endDate,
  token
) => {
  const response = await apiClient.get(`/api/transactions/get`, {
    params: { type, category, startDate, endDate },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const addTransactionAPI = async (transactionData, token) => {
  const response = await apiClient.post(
    `/api/transactions/add`,
    transactionData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

export const deleteTransactionAPI = async (transactionId, token) => {
  const response = await apiClient.post(
    `/api/transactions/delete`,
    { transactionId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

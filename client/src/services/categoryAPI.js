import { apiClient } from "./apiClient";

export const fetchCategoriesAPI = async (token) => {
  const response = await apiClient.get(`/api/categories/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const addCategoryAPI = async (category, token) => {
  const response = await apiClient.post(`/api/categories/add`, category, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const deleteCategoryAPI = async (categoryId, token) => {
  const response = await apiClient.post(
    `/api/categories/delete`,
    { categoryId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
};

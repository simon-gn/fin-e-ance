import { getCategories, addCategory, deleteCategory } from '../../services/api';

export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const ADD_CATEGORY_SUCCESS = 'ADD_CATEGORY_SUCCESS';
export const DELETE_CATEGORY_SUCCESS = 'DELETE_CATEGORY_SUCCESS';

export const fetchCategoriesAction = (token) => async (dispatch) => {
  try {
    const categories = await getCategories(token);
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export const addCategoryAction = (category, token) => async (dispatch) => {
  try {
    const newCategory = await addCategory(category, token);
    dispatch({ type: ADD_CATEGORY_SUCCESS, payload: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

export const deleteCategoryAction = (categoryId, token) => async (dispatch) => {
  try {
    await deleteCategory(categoryId, token);
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId });
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE
} from './categoryActionTypes';
import { fetchCategoriesAPI, addCategoryAPI, deleteCategoryAPI } from '../../services/api';

export const fetchCategoriesAction = () => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORIES_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const categories = await fetchCategoriesAPI(token);
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: categories.data });
  } catch (error) {
    dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.message })
  }
};

export const addCategoryAction = (category) => async (dispatch) => {
  dispatch({ type: ADD_CATEGORY_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const newCategory = await addCategoryAPI(category, token);
    dispatch({ type: ADD_CATEGORY_SUCCESS, payload: newCategory.data });
  } catch (error) {
    dispatch({ ADD_CATEGORY_FAILURE, payload: error.message })
  }
};

export const deleteCategoryAction = (categoryId) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    await deleteCategoryAPI(categoryId, token);
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId });
  } catch (error) {
    dispatch({ type: DELETE_CATEGORY_FAILURE, payload: error.message })
  }
};

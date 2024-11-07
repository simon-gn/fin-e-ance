import {
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
  ADD_TRANSACTION_REQUEST,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_FAILURE,
  DELETE_TRANSACTION_REQUEST,
  DELETE_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_FAILURE
} from './transactionActionTypes';
import { fetchTransactionsAPI, addTransactionAPI, deleteTransactionAPI } from '../../services/api';

export const fetchTransactionsAction = (type, category, startDate, endDate) => async (dispatch, getState) => {
  dispatch({ type: FETCH_TRANSACTIONS_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const transactions = await fetchTransactionsAPI(type, category, startDate, endDate, token);
    dispatch({ type: FETCH_TRANSACTIONS_SUCCESS, payload: transactions.data });
  } catch (error) {
    dispatch({ type: FETCH_TRANSACTIONS_FAILURE, payload: error.message });
  }
};

export const addTransactionAction = (transaction) => async (dispatch, getState) => {
  dispatch({ type: ADD_TRANSACTION_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const newTransaction = await addTransactionAPI(transaction, token);
    dispatch({ type: ADD_TRANSACTION_SUCCESS, payload: newTransaction.data });
  } catch (error) {
    dispatch({ type: ADD_TRANSACTION_FAILURE, payload: error.message });
  }
};

export const deleteTransactionAction = (transactionId) => async (dispatch, getState) => {
  dispatch({ type: DELETE_TRANSACTION_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    await deleteTransactionAPI(transactionId, token);
    dispatch({ type: DELETE_TRANSACTION_SUCCESS, payload: transactionId });
  } catch (error) {
    dispatch({ type: DELETE_TRANSACTION_FAILURE, payload: error.message });
  }
};
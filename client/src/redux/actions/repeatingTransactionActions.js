import {
  FETCH_REPEATINGTRANSACTIONS_REQUEST,
  FETCH_REPEATINGTRANSACTIONS_SUCCESS,
  FETCH_REPEATINGTRANSACTIONS_FAILURE,
  ADD_REPEATINGTRANSACTION_REQUEST,
  ADD_REPEATINGTRANSACTION_SUCCESS,
  ADD_REPEATINGTRANSACTION_FAILURE,
  DELETE_REPEATINGTRANSACTION_REQUEST,
  DELETE_REPEATINGTRANSACTION_SUCCESS,
  DELETE_REPEATINGTRANSACTION_FAILURE,
} from "./repeatingTransactionActionTypes";
import {
  fetchRepeatingTransactionsAPI,
  addRepeatingTransactionAPI,
  deleteRepeatingTransactionAPI,
} from "../../services/repeatingTransactionAPI";

export const fetchRepeatingTransactionsAction = () => async (dispatch) => {
  dispatch({ type: FETCH_REPEATINGTRANSACTIONS_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const repeatingTransactions = await fetchRepeatingTransactionsAPI(token);
    dispatch({
      type: FETCH_REPEATINGTRANSACTIONS_SUCCESS,
      payload: repeatingTransactions.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_REPEATINGTRANSACTIONS_FAILURE,
      payload: error.message,
    });
  }
};

export const addRepeatingTransactionAction =
  (repeatingTransaction) => async (dispatch) => {
    dispatch({ type: ADD_REPEATINGTRANSACTION_REQUEST });
    try {
      const token = localStorage.getItem("accessToken");
      const response = await addRepeatingTransactionAPI(
        repeatingTransaction,
        token
      );
      dispatch({
        type: ADD_REPEATINGTRANSACTION_SUCCESS,
        payload: response.data.newRepeatingTransaction,
      });
    } catch (error) {
      dispatch({
        type: ADD_REPEATINGTRANSACTION_FAILURE,
        payload: error.message,
      });
    }
  };

export const deleteRepeatingTransactionAction =
  (repeatingTransactionId) => async (dispatch) => {
    dispatch({ type: DELETE_REPEATINGTRANSACTION_REQUEST });
    try {
      const token = localStorage.getItem("accessToken");
      await deleteRepeatingTransactionAPI(repeatingTransactionId, token);
      dispatch({
        type: DELETE_REPEATINGTRANSACTION_SUCCESS,
        payload: repeatingTransactionId,
      });
    } catch (error) {
      dispatch({
        type: DELETE_REPEATINGTRANSACTION_FAILURE,
        payload: error.message,
      });
    }
  };

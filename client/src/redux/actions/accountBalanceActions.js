import {
  ADD_ACCOUNTBALANCE_FAILURE,
  ADD_ACCOUNTBALANCE_REQUEST,
  ADD_ACCOUNTBALANCE_SUCCESS,
  FETCH_ACCOUNTBALANCES_FAILURE,
  FETCH_ACCOUNTBALANCES_REQUEST,
  FETCH_ACCOUNTBALANCES_SUCCESS,
} from "./accountBalanceActionTypes";
import {
  setAccountBalanceAPI,
  fetchAccountBalancesAPI,
} from "../../services/accountBalanceAPI";

export const fetchAccountBalancesAction = () => async (dispatch) => {
  dispatch({ type: FETCH_ACCOUNTBALANCES_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const accountBalances = await fetchAccountBalancesAPI(token);
    dispatch({
      type: FETCH_ACCOUNTBALANCES_SUCCESS,
      payload: accountBalances.data,
    });
  } catch (error) {
    dispatch({ type: FETCH_ACCOUNTBALANCES_FAILURE, payload: error.message });
  }
};

export const setAccountBalanceAction = (amount) => async (dispatch) => {
  dispatch({ type: ADD_ACCOUNTBALANCE_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const { accountBalance } = await setAccountBalanceAPI(amount, token);
    dispatch({
      type: ADD_ACCOUNTBALANCE_SUCCESS,
      payload: accountBalance.data,
    });
  } catch (error) {
    dispatch({ type: ADD_ACCOUNTBALANCE_FAILURE, payload: error.message });
  }
};

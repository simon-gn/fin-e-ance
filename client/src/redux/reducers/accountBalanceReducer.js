import {
  ADD_ACCOUNTBALANCE_FAILURE,
  ADD_ACCOUNTBALANCE_REQUEST,
  ADD_ACCOUNTBALANCE_SUCCESS,
  DELETE_ACCOUNTBALANCE_FAILURE,
  DELETE_ACCOUNTBALANCE_REQUEST,
  DELETE_ACCOUNTBALANCE_SUCCESS,
  FETCH_ACCOUNTBALANCES_FAILURE,
  FETCH_ACCOUNTBALANCES_REQUEST,
  FETCH_ACCOUNTBALANCES_SUCCESS,
} from "../actions/accountBalanceActionTypes";

const initialState = {
  loading: false,
  accountBalances: [],
  error: null,
};

const accountBalanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTBALANCES_REQUEST:
    case ADD_ACCOUNTBALANCE_REQUEST:
    case DELETE_ACCOUNTBALANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ACCOUNTBALANCES_SUCCESS:
      return {
        ...state,
        loading: false,
        accountBalances: action.payload,
      };
    case ADD_ACCOUNTBALANCE_SUCCESS: {
      const updatedBalances = [...state.accountBalances, action.payload].sort(
        (a, b) => {
          const dateDiff = new Date(b.date) - new Date(a.date);
          if (dateDiff !== 0) {
            return dateDiff;
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      );

      const newEntryIndex = updatedBalances.findIndex(
        (balance) => balance._id === action.payload._id
      );

      let amountDiff = updatedBalances[newEntryIndex + 1]
        ? action.payload.amount - updatedBalances[newEntryIndex + 1].amount
        : action.payload.amount;

      const recalculatedBalances = updatedBalances.map((balance, index) => {
        if (index >= newEntryIndex) {
          return balance;
        }

        const updatedBalance = {
          ...balance,
          amount: Number(balance.amount) + amountDiff,
        };

        return updatedBalance;
      });

      return {
        ...state,
        loading: false,
        accountBalances: recalculatedBalances,
      };
    }
    case DELETE_ACCOUNTBALANCE_SUCCESS: {
      const newEntryIndex = state.accountBalances.findIndex(
        (balance) => balance.transaction === action.payload
      );

      let amountDiff = state.accountBalances[newEntryIndex + 1]
        ? state.accountBalances[newEntryIndex].amount -
          state.accountBalances[newEntryIndex + 1].amount
        : state.accountBalances[newEntryIndex].amount;

      const recalculatedBalances = state.accountBalances.map(
        (balance, index) => {
          if (index >= newEntryIndex) {
            return balance;
          }

          const updatedBalance = {
            ...balance,
            amount: Number(balance.amount) - amountDiff,
          };

          return updatedBalance;
        }
      );

      return {
        ...state,
        loading: false,
        accountBalances: recalculatedBalances.filter(
          (balance) => balance.transaction !== action.payload
        ),
      };
    }
    case FETCH_ACCOUNTBALANCES_FAILURE:
    case ADD_ACCOUNTBALANCE_FAILURE:
    case DELETE_ACCOUNTBALANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default accountBalanceReducer;

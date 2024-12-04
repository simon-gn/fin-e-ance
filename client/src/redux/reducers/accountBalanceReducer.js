import {
  SET_ACCOUNTBALANCE_FAILURE,
  SET_ACCOUNTBALANCE_REQUEST,
  SET_ACCOUNTBALANCE_SUCCESS,
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
    case SET_ACCOUNTBALANCE_REQUEST:
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
    case SET_ACCOUNTBALANCE_SUCCESS: {
      const updatedBalances = [...state.accountBalances, action.payload].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
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
    case FETCH_ACCOUNTBALANCES_FAILURE:
    case SET_ACCOUNTBALANCE_FAILURE:
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

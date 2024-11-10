import {
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
  ADD_TRANSACTION_REQUEST,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_FAILURE,
  DELETE_TRANSACTION_REQUEST,
  DELETE_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_FAILURE,
} from "../actions/transactionActionTypes";

const initialState = {
  loading: false,
  transactions: [],
  error: null,
};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRANSACTIONS_REQUEST:
    case ADD_TRANSACTION_REQUEST:
    case DELETE_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: action.payload,
      };
    case ADD_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: [action.payload, ...state.transactions],
      };
    case DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: state.transactions.filter(
          (transaction) => transaction._id !== action.payload,
        ),
      };
    case FETCH_TRANSACTIONS_FAILURE:
    case ADD_TRANSACTION_FAILURE:
    case DELETE_TRANSACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default transactionReducer;

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
} from "../actions/repeatingTransactionActionTypes";

const initialState = {
  loading: false,
  repeatingTransactions: [],
  error: null,
};

const repeatingTransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPEATINGTRANSACTIONS_REQUEST:
    case ADD_REPEATINGTRANSACTION_REQUEST:
    case DELETE_REPEATINGTRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REPEATINGTRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        repeatingTransactions: action.payload,
      };
    case ADD_REPEATINGTRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        repeatingTransactions: [
          ...state.repeatingTransactions,
          action.payload,
        ].sort((a, b) => {
          return new Date(b.startDate) - new Date(a.startDate);
        }),
      };
    case DELETE_REPEATINGTRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        repeatingTransactions: state.repeatingTransactions.filter(
          (repeatingTransaction) => repeatingTransaction._id !== action.payload
        ),
      };
    case FETCH_REPEATINGTRANSACTIONS_FAILURE:
    case ADD_REPEATINGTRANSACTION_FAILURE:
    case DELETE_REPEATINGTRANSACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default repeatingTransactionReducer;

import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./reducers/transactionReducer";
import accountBalanceReducer from "./reducers/accountBalanceReducer";
import categoryReducer from "./reducers/categoryReducer";

const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    accountBalances: accountBalanceReducer,
    categories: categoryReducer,
  },
});

export default store;

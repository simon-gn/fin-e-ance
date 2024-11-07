import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./reducers/transactionReducer";
import categoryReducer from "./reducers/categoryReducer";

const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    categories: categoryReducer,
  },
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categoryReducer';

const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
});

export default store;

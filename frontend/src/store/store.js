import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './slices/businessSlice';
import authUserReducer from './slices/authUserSlice';
import authBusinessReducer from "./slices/authBusinessSlice";

export const store = configureStore({
  reducer: {
    business: businessReducer,
    authUser: authUserReducer,
    authBusiness: authBusinessReducer,
  },
});

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  business: null,
  isAuthenticated: false,
  loading: true,
};

const authBusinessSlice = createSlice({
  name: 'authBusiness',
  initialState,
  reducers: {
    setLoggedInBusiness: (state, action) => {
      state.business = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearBusiness: (state) => {
      state.business = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setLoggedInBusiness, clearBusiness } = authBusinessSlice.actions;
export default authBusinessSlice.reducer;

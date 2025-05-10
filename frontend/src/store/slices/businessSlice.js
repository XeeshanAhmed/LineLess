import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBusiness: null, 
  selectedDepartment: null 
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusiness: (state, action) => {
      state.selectedBusiness = {
        businessId: action.payload.businessId,
        businessName: action.payload.name
      };
      state.selectedDepartment = null; // reset on business change
    },
    setDepartment: (state, action) => {
        console.log('payload',action.payload);
      state.selectedDepartment = {
        departmentId: action.payload._id,
        departmentName: action.payload.name
      };
    },
    resetSelection: (state) => {
      state.selectedBusiness = null;
      state.selectedDepartment = null;
    }
  }
});

export const { setBusiness, setDepartment, resetSelection } = businessSlice.actions;
export default businessSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  successMsg: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
      state.isAuthenticated = true;
    },
    loginFaill: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
      state.isAuthenticated = true;
    },
    updateFaill: (state, action) => {
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    deleteAccountStart: (state) => {
      state.loading = true;
    },
    deleteAccountSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    successMessage: (state, action) => {
      state.successMsg = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMsg = null;
    },
  },
});
export const {
  loginStart,
  loginSuccess,
  loginFaill,
  clearError,
  updateStart,
  updateSuccess,
  updateFaill,
  signoutSuccess,
  deleteAccountStart,
  deleteAccountSuccess,
  successMessage,
  clearSuccessMessage,
} = userSlice.actions;
export default userSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isVisible: false,
  message: '',
  title: '',
  type: 'success', // success, error, or warning
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.isVisible = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type || 'success';
    },
    hideToast: state => {
      state.isVisible = false;
      state.title = '';
      state.message = '';
      state.type = 'success';
    },
  },
});

const {reducer, actions} = toastSlice;
export const {showToast, hideToast} = actions;
export default reducer;

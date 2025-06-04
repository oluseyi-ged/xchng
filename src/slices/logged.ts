import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

const loggedSlice = createSlice({
  name: 'logged',
  initialState,
  reducers: {
    setLogged: (state, action) => {
      return action.payload;
    },
    clearLogged: () => {
      return false;
    },
  },
});

const { reducer, actions } = loggedSlice;
export const { setLogged, clearLogged } = actions;
export default reducer;

import { createSlice } from "@reduxjs/toolkit"
const initialState = {
  auth: <any>{},
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      return { ...state, auth: action.payload }
    },
    clearAuth: () => {
      return { auth: {} }
    },
  },
})

const { reducer, actions } = authSlice
export const { setAuth, clearAuth } = actions
export default reducer

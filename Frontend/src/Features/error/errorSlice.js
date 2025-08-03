import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    show: false,
    message: ''
  },
  reducers: {
    setError: (state, action) => {
      const {show, message} = action.payload
      state.show = show
      state.message = message
    },
    setShow: (state, action) => {
      state.show = action.payload
    },
    setMessage: (state, action) => {
      state.message = action.payload
    }
  }
})

export const { setError, setShow, setMessage } = errorSlice.actions
export default errorSlice.reducer
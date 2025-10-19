import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    home: null, 
    away: null
  },
  reducers: {
    setHome: (state, action) => {
      state.home = action.payload
    },
    setAway: (state, action) => {
      state.away = action.payload
    }
  }
})

export const { setHome, setAway } = teamSlice.actions
export default teamSlice.reducer
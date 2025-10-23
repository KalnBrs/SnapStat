import { createSlice } from '@reduxjs/toolkit';

const rosterSlice = createSlice({
  name: 'rosters',
  initialState: {
    home: [],
    away: []
  },
  reducers: {
    setRosterHome: (state, action) => {
      state.home = action.payload;
    },
    setRosterAway: (state, action) => {
      state.away = action.payload;
    }
  }
})

export const { setRosterHome, setRosterAway } = rosterSlice.actions
export default rosterSlice.reducer
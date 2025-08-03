import { createSlice } from '@reduxjs/toolkit';

const rosterSlice = createSlice({
  name: 'rosters',
  initialState: {
    home: [{
      "player_id": "1",
      "name": "Kaelan Brose",
      "number": 44,
      "team_id": "1"
    },
    {
      "player_id": "2",
      "name": "Tyler Brose",
      "number": 4,
      "team_id": "1"
    },
    {
      "player_id": "5",
      "name": "Random Person",
      "number": 5,
      "team_id": "1"
    }],
    away: [{
      "player_id": "4",
      "name": "Robert Brose",
      "number": 30,
      "team_id": "2"
    }]
  },
  reducers: {
    setHome: (state, action) => {
      state.home = action.payload;
    },
    setAway: (state, action) => {
      state.away = action.payload;
    }
  }
})

export const { setHome, setAway } = rosterSlice.actions
export default rosterSlice.reducer
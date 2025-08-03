import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    game: {
      game_id: 2,
      home_team_id: 1,
      away_team_id: 2,
      home_score: 0,
      away_score: 8,
      home_timeouts: 3,
      away_timeouts: 3,
      quarter: 1,
      down: 1,
      distance: 10,
      ball_on_yard: 25,
      possession_team_id: 1,
      current_drive_id: 6
    },
    offense: "home",
    return: false
  },
  reducers: {
    setGame: (state, action) => {
      state.game = action.payload
    },
    setOffense: (state, action) => {
      state.offense = action.payload
    },
    setReturn: (state, action) => {
      state.return = action.payload
    }
  }
})

export const { setGame, setOffense, setReturn } = gameSlice.actions
export default gameSlice.reducer
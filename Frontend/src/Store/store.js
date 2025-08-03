import { configureStore } from "@reduxjs/toolkit";
import rosterReducer from "../Features/roster/rosterSlice";
import gameReducer from "../Features/game/gameSlice"
import teamReducer from "../Features/team/teamSlice";
import nodeReducer from "../Features/node/nodeSlice";
import errorReducer from "../Features/error/errorSlice";

const store = configureStore({
  reducer: {
    roster: rosterReducer,
    game: gameReducer,
    team: teamReducer,
    node: nodeReducer,
    error: errorReducer
  }
})

export default store
import { configureStore } from "@reduxjs/toolkit";
import rosterReducer from "../Features/roster/rosterSlice";
import gameReducer from "../Features/game/gameSlice"
import teamReducer from "../Features/team/teamSlice";
import nodeReducer from "../Features/node/nodeSlice";
import errorReducer from "../Features/error/errorSlice";
import userSlice from "../Features/user/userSlice";

const store = configureStore({
  reducer: {
    roster: rosterReducer,
    game: gameReducer,
    team: teamReducer,
    node: nodeReducer,
    error: errorReducer,
    user: userSlice
  }
})

store.subscribe(() => {
  // console.log("State updated:", store.getState());
});

export default store
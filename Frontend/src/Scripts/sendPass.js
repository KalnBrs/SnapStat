import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../Features/game/gameSlice";
import store from "../Store/store";
import { setDefenseNode, setOffenseNode, setPenaltyNode } from "../Features/node/nodeSlice";

async function sendPass(play_end, end_yard, result, down_to, distance_to, players, type) {
  const gameState = store.getState().game.game
  /** 
  const response = await fetch(`http://localhost:8000/api/games/${gameState.game_id}/plays`, {
    method: "Post",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthZWxhbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjYzMzI3NiwiZXhwIjoxNzUyNjM1MDc2fQ.J0_RcXXp2MS0kuyU2uOVDWjLfhQQ2CO6ch083N4YIn0", 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "play_type": type, // Could be pass or defense depending on touchdown or not
        "start_yard": gameState.ball_on_yard,
        "end_yard": play_end,
        "down": down_to, 
        "distance": distance_to,
        "ball_on": end_yard,
        "result": result,
        "possession_team_id": gameState.possession_team_id,
        "players": players
      })
    })
  */

  const response = { game: {
    game_id: 2,
    home_team_id: 1,
    away_team_id: 2,
    home_score: 0,
    away_score: 8,
    home_timeouts: 3,
    away_timeouts: 3,
    quarter: 1,
    down: down_to,
    distance: distance_to,
    ball_on_yard: end_yard,
    possession_team_id: 1,
    current_drive_id: 6
  }}

  return response
}

async function runPass(res) {
  const state = store.getState()
  const game = state.game.game
  const offensiveNode = state.node.offenseNode
  const deffensiveNode = state.node.defenseNode
  const penaltyNode = state.node.penaltyNode

  const { type, result, play_end, end_yard, down_to, distance_to, ball_on_yard, players} = res
  const response = await sendPass(play_end, end_yard, result, down_to, distance_to, players, type)
  console.log(game)
  store.dispatch(setGame({
    ...game,
    home_score: response.game.home_score, 
    away_score: response.game.away_score,
    down: response.game.down,
    distance: response.game.distance,
    ball_on_yard: response.game.ball_on_yard,
  }))
  console.log(end_yard)
  const end_px_start = (end_yard + 5) * 10
  const end_px_end = (end_yard + 10) * 10

  store.dispatch(setOffenseNode({id: "Start", x: end_px_start, y: offensiveNode.Start.y }))
  store.dispatch(setOffenseNode({id: "End", x: end_px_end, y: offensiveNode.End.y }))
  store.dispatch(setDefenseNode({id: "Start", x: end_px_start, y: deffensiveNode.Start.y}))
  store.dispatch(setDefenseNode({id: "End", x: end_px_end, y: deffensiveNode.End.y}))
  store.dispatch(setPenaltyNode({id: "Start", x: end_px_start, y: penaltyNode.Start.y}))
  store.dispatch(setPenaltyNode({id: "End", x: end_px_end, y: penaltyNode.End.y}))
}

// Calculates the next down, distance, and ball position after a pass play
function calculateNextDownAndDistance(
  currentDown,
  currentDistance,
  startYard,
  endYard,
  incomplete = false,
  turnover = false,
  touchdown = false,
  touchback = false,
  defenseScore = false,
  autoFirst = false,
) {
  let down_to, distance_to, ball_on_yard;

  if (incomplete) {
    down_to = currentDown += 1
    distance_to = currentDistance
    return { down_to, distance_to, startYard };
  }

  // 1. Defensive touchdown
  if (defenseScore) {
      down_to = 1;
      distance_to = 3;
      ball_on_yard = 97; // kickoff spot
      return { down_to, distance_to, ball_on_yard };
  }

  // 2. Touchback (interception/fumble return or end-zone play)
  if (touchback) {
      down_to = 1;
      distance_to = 10;
      ball_on_yard = 25; // league-specific
      return { down_to, distance_to, ball_on_yard };
  }

  // 3. Offensive touchdown
  if (touchdown) {
      down_to = 1;
      distance_to = 3;
      ball_on_yard = 97; // kickoff spot
      return { down_to, distance_to, ball_on_yard };
  }

  // 4. Turnover (non-scoring)
  if (turnover) {
      down_to = 1;
      distance_to = 10;
      ball_on_yard = 100 - endYard; 
      return { down_to, distance_to, ball_on_yard };
  }

  // 5. Normal progression
  const yardsGained = endYard - startYard;
  const yardsRemaining = currentDistance - yardsGained;

  if (yardsRemaining <= 0) {
      // First down achieved
      down_to = 1;
      distance_to = endYard >= 90 ? 100 - endYard : 10; // goal-to-go adjustment
  } else {
      down_to = currentDown + 1;
      distance_to = yardsRemaining;

      // Turnover on downs
      if (down_to > 4) {
          down_to = 1;
          distance_to = 10;
          ball_on_yard = 100 - endYard; // new offense takes over
          return { down_to, distance_to, ball_on_yard };
      }
  }

  ball_on_yard = endYard;
  return { down_to, distance_to, ball_on_yard };
}


export { sendPass, runPass, calculateNextDownAndDistance }
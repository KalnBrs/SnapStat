import { setGame } from "../Features/game/gameSlice";
import { yardToPx } from "./utilities";
import store from "../Store/store";
import {
  setDefenseNode,
  setOffenseNode,
  setPenaltyNode,
} from "../Features/node/nodeSlice";

/**
 * sendRush — sends play to backend (or mocked if API off)
 */
async function sendRush({
  play_type,
  result,
  start_yard,
  end_yard,
  down,
  distance,
  ball_on,
  possession_team_id,
  players,
  isTurnover
}) {
  const gameState = store.getState().game.game;
  const response = await fetch(`http://localhost:8000/api/games/${gameState.game_id}/plays`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer <Token>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      play_type,
      start_yard,
      end_yard,
      down,
      distance,
      ball_on,
      result,
      possession_team_id,
      players,
      isTurnover
    }),
  });
  return await response.json();
}

/**
 * runRush — updates Redux after sending play
 */
async function runRush(res) {
  if (!res) return;

  const state = store.getState();
  const game = state.game.game;
  const offensiveNode = state.node.offenseNode || {};
  const defensiveNode = state.node.defenseNode || {};
  const penaltyNode = state.node.penaltyNode || {};

  const {
    type,
    result,
    play_end,
    end_yard,
    down_to,
    distance_to,
    ball_on_yard,
    players,
    isTurnover
  } = res;

  // Defensive guard: ensure ball_on_yard and distance_to are numbers
  if (typeof ball_on_yard !== "number" || Number.isNaN(ball_on_yard)) {
    console.error("runPass: invalid ball_on_yard:", ball_on_yard);
    return;
  }
  if (typeof distance_to !== "number" || Number.isNaN(distance_to)) {
    console.error("runPass: invalid distance_to:", distance_to);
    return;
  }

  // Call API
  const response = await sendRush({
    play_type: type,
    result,
    start_yard: game.ball_on_yard,
    end_yard: play_end,
    down: down_to,
    distance: distance_to,
    ball_on: ball_on_yard,
    possession_team_id: game.possession_team_id,
    players,
    isTurnover
  });

  if (!response || !response.game) {
    console.error("runPass: invalid response from sendPass", response);
    return;
  }

  // Update game state
  store.dispatch(
    setGame({
      ...game,
      home_score: response.game.home_score,
      away_score: response.game.away_score,
      down: response.game.down,
      distance: response.game.distance,
      ball_on_yard: response.game.ball_on_yard,
      possession_team_id: response.game.possession_team_id ?? game.possession_team_id,
    })
  );

  // Reset field nodes
  const ballY = response.game.ball_on_yard;
  const toGo = response.game.distance;

  const startPx = yardToPx(ballY);
  const endPx = yardToPx(Math.min(100, Math.max(0, ballY + toGo)));

  store.dispatch(setOffenseNode({ id: "Start", x: startPx, y: offensiveNode?.Start?.y ?? 0 }));
  store.dispatch(setOffenseNode({ id: "End", x: endPx, y: offensiveNode?.End?.y ?? 0 }));
  store.dispatch(setDefenseNode({ id: "Start", x: startPx, y: defensiveNode?.Start?.y ?? 0 }));
  store.dispatch(setDefenseNode({ id: "End", x: endPx, y: defensiveNode?.End?.y ?? 0 }));
  store.dispatch(setPenaltyNode({ id: "Start", x: startPx, y: penaltyNode?.Start?.y ?? 0 }));
  store.dispatch(setPenaltyNode({ id: "End", x: endPx, y: penaltyNode?.End?.y ?? 0 }));
}

/**
 * calculateNextDownAndDistanceRush
 */
function calculateNextDownAndDistanceRush(
  currentDown,
  currentDistance,
  startYard,
  endYard,
  turnover = false,
  touchdown = false,
  touchback = false,
  defenseScore = false,
  autoFirst = false,
  penCondition = false,
  penaltyYards = 0,
  safety = false
) {
  console.log(turnover, touchdown, touchback, defenseScore, autoFirst, safety, penCondition)
  console.log("currentDown: " + currentDown)
  console.log("currentDistance: " + currentDistance)
  console.log("startYard: " + startYard)
  console.log("endYard: " + endYard)

  let down_to = currentDown;
  let distance_to = currentDistance;
  let ball_on_yard = endYard;

  // Penalty check
  if (penCondition && penaltyYards !== 0) {
    let newBall = 0
    let newDistance = 0;
    if (penaltyYards < 0) {
      console.log("run2")
      ball_on_yard = Math.min(100, Math.max(0, startYard + penaltyYards));

      // Adjust distance: line-to-gain changes by penalty
      newDistance = currentDistance - penaltyYards;
      console.log(newDistance)
      if (newDistance < 1) newDistance = 1; // min distance is 1 yard
    } else {
      console.log("run3")
      newBall = Math.min(100, Math.max(0, ball_on_yard + penaltyYards));

      // Adjust distance: line-to-gain changes by penalty
      newDistance = currentDistance - penaltyYards;
      console.log(newDistance)
      if (newDistance < 1) newDistance = 1; // min distance is 1 yard
    }

    return { down_to, distance_to: newDistance, ball_on_yard, isTurnover: false };
  }

  if (defenseScore) return { down_to: 1, distance_to: 10, ball_on_yard: 97, isTurnover: true };
  if (touchback) return { down_to: 1, distance_to: 10, ball_on_yard: 25, isTurnover: true };
  if (touchdown) return { down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: false };
  if (turnover) return { down_to: 1, distance_to: 10, ball_on_yard: 100 - endYard, isTurnover: true };
  if (safety) return { down_to: 1, distance_to: 10, ball_on_yard: 20, isTurnover: false };


  const yardsGained = endYard - startYard;
  const yardsRemaining = currentDistance - yardsGained;

  if (yardsRemaining <= 0 || autoFirst) {
    down_to = 1;
    distance_to = endYard >= 90 ? 100 - endYard : 10;
    ball_on_yard = endYard;
  } else {
    down_to = currentDown + 1;
    distance_to = yardsRemaining;
    ball_on_yard = endYard;

    if (down_to > 4) {
      return { down_to: 1, distance_to: 10, ball_on_yard: 100 - endYard, isTurnover: true };
    }
  }

  return { down_to, distance_to, ball_on_yard, isTurnover: false };
}

export { sendRush, runRush, calculateNextDownAndDistanceRush };
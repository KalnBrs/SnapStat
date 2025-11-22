// Scripts/sendPass.js (replace existing)
import { setGame } from "../Features/game/gameSlice";
import { yardToPx } from "./utilities";
import store from "../Store/store";
import {
  setDefenseNode,
  setOffenseNode,
  setPenaltyNode,
} from "../Features/node/nodeSlice";

/**
 * Single API call to persist a pass play.
 * Accepts the payload in your existing shape.
 */
async function sendPass({
  play_type,
  result,
  start_yard,
  end_yard,
  down,
  distance,
  ball_on,
  possession_team_id,
  players,
  isTurnover,
  defSafety
}) {
  const gameState = store.getState().game.game;
  const user = store.getState().user.user

  const response = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/games/${gameState.game_id}/plays`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
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
      isTurnover,
      defSafety
    }),
  });
  return await response.json();
}

/**
 * runPass: accept the play object returned from generatePassPlay()
 * - sends to backend
 * - updates local game slice
 * - updates field nodes (Start = ball_on_yard, End = ball_on_yard + distance)
 */
async function runPass(res) {
  if (!res) {
    console.warn("runPass called with null/undefined play result.");
    return;
  }

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
    isTurnover,
    defSafety
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

  // Send single API call
  const response = await sendPass({
    play_type: type,
    result,
    start_yard: game.ball_on_yard,
    end_yard: play_end,
    down: down_to,
    distance: distance_to,
    ball_on: ball_on_yard,
    possession_team_id: game.possession_team_id,
    players,
    isTurnover,
    defSafety
  });

  if (!response || !response.game) {
    console.error("runPass: invalid response from sendPass", response);
    return;
  }

  // Update authoritative game slice
  store.dispatch(
    setGame({
      ...game,
      home_score: response.game.home_score,
      away_score: response.game.away_score,
      down: response.game.down,
      distance: response.game.distance,
      ball_on_yard: response.game.ball_on_yard,
      possession_team_id: response.game.possession_team_id,
    })
  );

  // Use yardToPx helper and use distance from response to create the End node (first-down)
  const ballY = response.game.ball_on_yard;
  const toGo = Number(response.game.distance) || distance_to || 10;

  const startPx = yardToPx(ballY);
  const endPx = yardToPx(Math.min(100, Math.max(0, ballY + toGo))); // clamp between 0 and 100

  // Defensive guards for node Y positions (fallback to 0 if missing)
  const offStartY = offensiveNode?.Start?.y ?? 0;
  const offEndY = offensiveNode?.End?.y ?? 0;
  const defStartY = defensiveNode?.Start?.y ?? 0;
  const defEndY = defensiveNode?.End?.y ?? 0;
  const penStartY = penaltyNode?.Start?.y ?? 0;
  const penEndY = penaltyNode?.End?.y ?? 0;

  // Dispatch node updates
  store.dispatch(setOffenseNode({ id: "Start", x: startPx, y: offStartY }));
  store.dispatch(setOffenseNode({ id: "End", x: endPx, y: offEndY }));
  store.dispatch(setDefenseNode({ id: "Start", x: startPx, y: defStartY }));
  store.dispatch(setDefenseNode({ id: "End", x: endPx, y: defEndY }));
  store.dispatch(setPenaltyNode({ id: "Start", x: startPx, y: penStartY }));
  store.dispatch(setPenaltyNode({ id: "End", x: endPx, y: penEndY }));
}

/**
 * calculateNextDownAndDistancePass remains positional (as you call it).
 * Keep this implementation external if you like — but ensure callers pass numbers.
 */
function calculateNextDownAndDistancePass(
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
  safety = false,
  penCondition = false,
  penaltyYards = 0,
  defSafety = false,
  result
) {

  let down_to = currentDown;
  let distance_to = currentDistance;
  let ball_on_yard = endYard; // default to end of play

  if (result == "2pt_made" || result == "2pt_missed") {
    return { down_to: 1, distance_to: 20, ball_on_yard: 40, isTurnover: false };
  }

  // 8. Apply penalty if applicable
  if (penCondition && penaltyYards !== 0) {
    let newBall = 0;
    let newDistance = 0;
    if (penaltyYards < 0) {
      newBall = Math.min(100, Math.max(0, startYard + penaltyYards));

      // Adjust distance: line-to-gain changes by penalty
      newDistance = currentDistance - penaltyYards;
      if (newDistance < 1) newDistance = 1; // min distance is 1 yard
    } else {
      newBall = Math.min(100, Math.max(0, ball_on_yard + penaltyYards));

      // Adjust distance: line-to-gain changes by penalty
      newDistance = currentDistance - penaltyYards;
      if (newDistance < 1) newDistance = 1; // min distance is 1 yard
    }

    return { down_to, distance_to: newDistance, ball_on_yard: newBall, isTurnover: false };
  }

  // 1. Incomplete pass → ball stays at line of scrimmage
  if (incomplete) {
    if (down_to > 4) {
      return { down_to: 1, distance_to: 10, ball_on_yard: 100 - endYard, isTurnover: true };
    }
    return { down_to: currentDown + 1, distance_to: currentDistance, ball_on_yard: startYard };
  }

  if (defSafety) return { down_to: 1, distance_to: 10, ball_on_yard: 20, isTurnover: true };

  // 2. Defensive touchdown → kickoff
  if (defenseScore) return { down_to: 1, distance_to: 10, ball_on_yard: 97, isTurnover: true };

  // 3. Touchback
  if (touchback) return { down_to: 1, distance_to: 10, ball_on_yard: 25, isTurnover: true };

  // 4. Offensive touchdown → kickoff
  if (touchdown) return { down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: false };

  // 5. Safety → free kick
  if (safety) return { down_to: 1, distance_to: 10, ball_on_yard: 20, isTurnover: false };
  // 6. Interception or fumble (non-scoring) → other team takes over
  if (turnover) return { down_to: 1, distance_to: 10, ball_on_yard: 100 - endYard, isTurnover: true };

  // 7. Normal completion / progress
  const yardsGained = endYard - startYard;
  const yardsRemaining = currentDistance - yardsGained;


  if (yardsRemaining <= 0 || autoFirst) {
    // First down achieved
    down_to = 1;
    distance_to = endYard >= 90 ? 100 - endYard : 10;
    ball_on_yard = endYard;
  } else {
    down_to = currentDown + 1;
    distance_to = yardsRemaining;
    ball_on_yard = endYard;

    // Turnover on downs
    if (down_to > 4) {
      return { down_to: 1, distance_to: 10, ball_on_yard: 100 - endYard, isTurnover: true };
    }
  }

  return { down_to, distance_to, ball_on_yard, isTurnover: false };
}


export { sendPass, runPass, calculateNextDownAndDistancePass };

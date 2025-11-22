import { setGame } from "../Features/game/gameSlice";
import { yardToPx } from "./utilities";
import store from "../Store/store";
import {
  setDefenseNode,
  setOffenseNode,
  setPenaltyNode,
} from "../Features/node/nodeSlice";

function generateKickPlayersArray(req) {
  const {
    kicker,
    returner,
    blocker,
    kickType,
    blocked,
    onside,
    kickYards,
    retYards
  } = req

  const players = [
    { player_id: kicker.player_id, role: "kicker", value: kickYards }
  ]
  if (kickType.label == "Extra Point" && blocked) {
    players.push({ player_id: blocker.player_id, role: "blocker", value: retYards})
  }
  if (kickType.label == "Field Goal" && blocked) {
    players.push({ player_id: blocker.player_id, role: "blocker", value: retYards})
  }
  if (kickType.label == "Punt") {
    if (!onside && !blocked) {
      players.push({ player_id: returner.player_id, role: "returner", value: retYards})
    } else if (blocked) {
      players.push({ player_id: blocker.player_id, role: "blocker", value: retYards})
    }
  }
  if (kickType.label == "Kick Off" && !onside) {
    players.push({ player_id: returner.player_id, role: "returner", value: retYards})
  }

  return players
}

function generateKickResultData(req) {
  const {kickType, blocked, retNodes, kickNodes, made, onside, fairCatch} = req
  let result = ""
  let playType = kickType.value
  let offTouchdown = false 
  let defTouchdown = false 
  let touchback = false 
  let safety = false

  if (playType == "field_goal") {
    if (blocked && (retNodes.End.x - 50) / 10 <= 0) {
      playType = "defense"
      result = "Blocked kick TD"
      defTouchdown = true
    }
    else if (blocked) {
      result = "Field Goal Blocked"
    }
    else if (made) {
      result = "Field Goal Made"
    } else if (!made) {
      result = "Field Goal Missed"
    }
  } else if (playType == "extra_point") {
    if (blocked && (retNodes.End.x - 50) / 10 <= 0) {
      playType = "defense"
      result = "Blocked extra TD"
      defTouchdown = true
    } else if (blocked) {
      result = "Extra Point Blocked"
    } else if (made) {
      result = "Extra Point Made"
    } else if (!made) [
      result = "Extra Point Missed"
    ]
  } else if (playType == "punt") {
    if (onside && (kickNodes.End.x - 50) / 10 >= 100) {
      result = "Offensive Touchdown"
      offTouchdown = true
    } else if (onside) {
      result = "Offensive Recovery"
    } else if ((retNodes.End.x - 50) / 10 <= 0) {
      result = "Touchdown"
      defTouchdown = true
    } else if ((retNodes.End.x - 50) / 10 >= 100 && (retNodes.Start.x - 50) / 10 < 100) {
      result = "Safety"
      safety = true
    } else if ((retNodes.End.x - 50) / 10 >= 100 && (retNodes.Start.x - 50) / 10 >= 100) {
      result = "Touchback"
      touchback = true
    } else if (blocked && (retNodes.End.x - 50) / 10 <= 0) {
      playType = "defense"
      result = "Blocked punt TD"
      defTouchdown = true
    } else if (blocked) {
      result = "Punt Blocked"
    } else if (fairCatch) {
      result = "Fair Catch"
    } else {
      result = "Punt Return"
    }
  } else if (playType == "kickoff") {
    if (onside && (kickNodes.End.x - 50) / 10 >= 100) {
      result = "On-side Touchdown"
      offTouchdown = true
    } else if (onside) {
      result = "On-side"
    } else if ((retNodes.End.x - 50) / 10 <= 0) {
      result = "Touchdown"
      defTouchdown = true
    } else if ((retNodes.End.x - 50) / 10 >= 100 && (retNodes.Start.x - 50) / 10 < 100) {
      result = "Safety"
      safety = true
    } else if ((retNodes.End.x - 50) / 10 >= 100 && (retNodes.Start.x - 50) / 10 >= 100) {
      result = "Touchback"
      touchback = true
    } else if (fairCatch) {
      result = "Fair Catch"
    } else {
      result = "Kick Return"
    }
  }

  return {
    result,
    playType,
    offTouchdown,
    defTouchdown,
    touchback,
    safety
  }
}

function calculateKickDown(req) {
  const {playType, kickNodes, retNodes, result, penNodes, penCondition} = req

  if (playType == "extra_point") {
    return {down_to: 1, distance_to: 20, ball_on_yard: 40, isTurnover: false}
  } else if (playType == "field_goal") {
    if (result == "Blocked kick TD") {
      return { down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: true }
    }
    if (result == "Field Goal Blocked") {
      const endYard = (retNodes.End.x - 50)/10
      return { down_to: 1, distance_to: endYard >= 90 ? 100 - endYard : 10, ball_on_yard: 100 - endYard, isTurnover: true}
    }
    if (result == "Field Goal Made") {
      return { down_to: 1, distance_to: 20, ball_on_yard: 40, isTurnover: false}
    }
    if (result == "Field Goal Missed") {
      const startYard = (kickNodes.Start.x - 50)/10
      return { down_to: 1, distance_to: startYard <= 10 ? startYard : 10, ball_on_yard: startYard, isTurnover: true}
    }

  } else if (playType == "punt") {
    const penYards = penCondition ? (penNodes.End.x - 50) / 10 - (penNodes.Start.x - 50) / 10 : 0
    if (result == 'Offensive Touchdown'){
      return {down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: false}
    }
    if (result == 'Offensive Recovery') {
      const endYard = (kickNodes.End.x - 50)/10
      return {down_to: 1, distance_to: endYard >= 90 ? 100-endYard : 10, ball_on_yard: endYard - penYards , isTurnover: false}
    }
    if (result == 'Touchdown') {
      return {down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: true}
    }
    if (result == 'Safety') {
      return {down_to: 1, distance_to: 20, ball_on_yard: 20, isTurnover: true}
    }
    if (result == 'Touchback') {
      return {down_to: 1, distance_to: 10, ball_on_yard: 25, isTurnover: true}
    }
    if (result == 'Blocked punt TD') {
      return {down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: true}
    }
    if (result == 'Punt Blocked') {
      const endYard = (retNodes.End.x - 50)/10
      return { down_to: 1, distance_to: endYard >= 90 ? 100 - endYard : 10, ball_on_yard: 100 - endYard - penYards, isTurnover: true}
    }
    if (result == 'Fair Catch') {
      const endYard = (retNodes.End.x - 50)/10
      return { down_to: 1, distance_to: endYard >= 90 ? 100 - endYard : 10, ball_on_yard: 100 - endYard - penYards, isTurnover: true}
    }
    const endYard = (retNodes.End.x - 50)/10
    return {down_to: 1, distance_to: endYard >= 90 ? 100 - endYard : 10, ball_on_yard:  100 - endYard - penYards, isTurnover: true}

  } else if (playType == "kickoff") {
    const penYards = penCondition ? (penNodes.End.x - 50) / 10 - (penNodes.Start.x - 50) / 10 : 0
    if (result == 'On-side Touchdown') {
      return { down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: false}
    }
    if (result == 'On-side') {
      const endYard = (kickNodes.End.x - 50)/10
      return {down_to: 1, distance_to: endYard >= 90 ? 100 - endYard : 10, ball_on_yard: endYard - penYards, isTurnover: false}
    }
    if (result == 'Touchdown') {
      return {down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: true}
    }
    if (result == 'Safety') {
      return {down_to: 1, distance_to: 20, ball_on_yard: 20, isTurnover: true}
    }
    if (result == 'Touchback') {
      return {down_to: 1, distance_to: 10, ball_on_yard: 25, isTurnover: true}
    }
    if (result == 'Fair Catch') {
      const endYard = (retNodes.End.x - 50)/10
      return {down_to: 1, distance_to: endYard >= 90 ? 100 - endYard : 10, ball_on_yard: 100 - endYard - penYards, isTurnover: true}
    }
    const endYard = (retNodes.End.x - 50)/10
    return {down_to: 1, distance_to: endYard >= 90 ? 100 - endYard : 10, ball_on_yard: 100 - endYard - penYards, isTurnover: true}
  } else if (playType == "defense") {
    if (result == 'Blocked punt TD') {
      return {down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: true}
    } 
    if (result == 'Blocked kick TD') {
      return {down_to: 1, distance_to: 3, ball_on_yard: 97, isTurnover: true}
    }
    if (result == 'Blocked extra TD') {
      return {down_to: 1, distance_to: 20, ball_on_yard: 40, isTurnover: false}
    }
  }
}

async function sendKick({
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
  const gameState = store.getState().game.game
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
    })
  })
  return await response.json();
}

async function runKick(res) {
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
  const response = await sendKick({
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
    console.error("runKick: invalid response from sendKick", response);
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


export {generateKickPlayersArray, generateKickResultData, calculateKickDown, runKick}
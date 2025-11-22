import store from "../Store/store"

async function updateQuarter(quarter) {
  const gamestate = store.getState().game.game
  const user = store.getState().user.user
  const response = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/games/${gamestate.game_id}/state`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quarter: quarter
    })
  });
  return await response.json();
}

async function updateFinished(value) {
  const gamestate = store.getState().game.game
  const user = store.getState().user.user
  const response = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/games/${gamestate.game_id}/state`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "finished": value
    })
  });
  return await response.json();
}

async function flipPoss(poss_id) {
  const gamestate = store.getState().game.game
  const user = store.getState().user.user
  const response = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/games/${gamestate.game_id}/state`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "possession_team_id": poss_id
    })
  });
  return await response.json();
} 

async function updateTimeout(timeoutTeam, timeoutTo) {
  const gamestate = store.getState().game.game
  const user = store.getState().user.user
  const response = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/games/${gamestate.game_id}/state`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      [timeoutTeam]: timeoutTo
    })
  });
  return await response.json();
}

export {updateQuarter, updateTimeout, flipPoss, updateFinished}
import store from "../Store/store"

async function updateQuarter(quarter) {
  const gamestate = store.getState().game.game
  const response = await fetch(`http://localhost:8000/api/games/${gamestate.game_id}/state`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer <Token>",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quarter: quarter
    })
  });
  return await response.json();
}

async function updateTimeout(timeoutTeam, timeoutTo) {
  const gamestate = store.getState().game.game
  const response = await fetch(`http://localhost:8000/api/games/${gamestate.game_id}/state`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer <Token>",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      [timeoutTeam]: timeoutTo
    })
  });
  return await response.json();
}

export {updateQuarter, updateTimeout}
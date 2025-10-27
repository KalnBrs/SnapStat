import store from "../Store/store"

async function getPlays(game_id) {
  const user = store.getState().user.user
  const result = await fetch(`http://localhost:8000/api/games/${game_id}/plays`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!result.ok) {
    throw new Error("Error in getting plays")
  }

  return await result.json();
}

async function getTeam(team_id) {
  const user = store.getState().user.user
  const result = await fetch(`http://localhost:8000/api/teams/${team_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!result.ok) {
    throw new Error("Error in getting team")
  }

  return await result.json();
}

async function startGame(homeTeamId, awayTeamId, date) {
  const user = store.getState().user.user
  const result = await fetch(`http://localhost:8000/api/games`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "home_team_id": homeTeamId,
      "away_team_id": awayTeamId,
      "date": date
    })
  })
  
  if (!result.ok) {
    throw new Error("Error Creating Game")
  }

  const data = await result.json()

  const result2 = await fetch(`http://localhost:8000/api/games/${data.game_id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "quarter": 1,
      "home_score": 0,
      "down": 1,
      "distance": 20,
      "ball_on_yard": 40,
      "possession_team_id": 1
    })
  })

  if (!result2.ok) {
    throw new Error("Error Starting Game")
  }

  return await result2.json()
}

async function getGameOnID(game_id) {
  const user = store.getState().user.user
  const response = await fetch(`http://localhost:8000/api/games/${game_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!response.ok) {
    console.error("getGameOnID caused an error")
  }

  return await response.json();
}

export { getTeam, startGame, getGameOnID, getPlays }
import store from "../Store/store"

async function getTeam(team_id) {
  const user = store.getState().user.user
  const result = await fetch(`http://localhost:8000/api/teams/${team_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!result.ok) {
    console.error("HTTP request did not work")
  }

  return await result.json();
}

async function startGame(homeTeamId, awayTeamId) {
  const user = store.getState().user.user
  const result = await fetch(`http://localhost:8000/api/games`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "home_team_id": homeTeamId,
      "away_team_id": awayTeamId
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

export { getTeam, startGame }